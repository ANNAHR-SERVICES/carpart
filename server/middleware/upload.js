const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Générer un nom unique pour le fichier
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtre pour les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  // Vérifier le type MIME
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées!'), false);
  }
};

// Configuration de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 10 // Maximum 10 fichiers
  }
});

// Middleware pour upload multiple d'images
const uploadImages = upload.array('images', 10);

// Middleware wrapper avec gestion d'erreurs
const handleImageUpload = (req, res, next) => {
  uploadImages(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Erreur Multer
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          success: false, 
          message: 'Fichier trop volumineux. Taille maximum: 5MB' 
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ 
          success: false, 
          message: 'Trop de fichiers. Maximum: 10 images' 
        });
      }
      return res.status(400).json({ 
        success: false, 
        message: 'Erreur lors de l\'upload: ' + err.message 
      });
    } else if (err) {
      // Autre erreur
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
    
    // Vérifier qu'au moins une image a été uploadée
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Au moins une image est requise' 
      });
    }
    
    // Ajouter les URLs des images à req.body
    req.body.images = req.files.map(file => {
      return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    });
    
    next();
  });
};

module.exports = {
  handleImageUpload,
  uploadDir
}; 