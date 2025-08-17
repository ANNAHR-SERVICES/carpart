const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { handleImageUpload } = require('../middleware/upload');
const { authenticateJWT } = require('../middleware/auth');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getSellerProducts
} = require('../controllers/productController');

// Validation pour la création/mise à jour de produit
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Le nom doit contenir entre 3 et 100 caractères'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La description doit contenir entre 10 et 1000 caractères'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif'),
  
  body('category')
    .isIn(['Engine', 'Transmission', 'Brakes', 'Suspension', 'Electrical', 'Body', 'Interior', 'Other'])
    .withMessage('Catégorie invalide'),
  
  body('brand')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La marque doit contenir entre 2 et 50 caractères'),
  
  body('model')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le modèle doit contenir entre 2 et 50 caractères'),
  
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Année invalide'),
  
  body('condition')
    .isIn(['New', 'Used', 'Refurbished'])
    .withMessage('Condition invalide'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Le stock doit être un nombre entier positif')
];

// Routes publiques
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Routes protégées (nécessitent une authentification)
router.use(authenticateJWT);

// Routes pour les vendeurs
router.get('/seller/my-products', getSellerProducts);

// Créer un nouveau produit (avec upload d'images)
router.post('/', handleImageUpload, productValidation, createProduct);

// Mettre à jour un produit (avec upload d'images optionnel)
router.put('/:id', handleImageUpload, productValidation, updateProduct);

// Supprimer un produit
router.delete('/:id', deleteProduct);

module.exports = router; 