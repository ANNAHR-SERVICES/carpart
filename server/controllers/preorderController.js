const Preorder = require('../models/Preorder');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');

// Validation des ObjectIds MongoDB
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// 1. Créer une précommande
const createPreorder = async (req, res) => {
  try {
    const { productId, vendorId, quantity, customerName, phone } = req.body;

    // Validation des données
    if (!productId || !vendorId || !quantity || !customerName || !phone) {
      return res.status(400).json({ 
        error: 'Tous les champs sont requis' 
      });
    }

    // Validation des ObjectIds
    if (!isValidObjectId(productId) || !isValidObjectId(vendorId)) {
      return res.status(400).json({ 
        error: 'IDs de produit ou vendeur invalides' 
      });
    }

    // Vérifier que le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        error: 'Produit non trouvé' 
      });
    }

    // Vérifier que le vendeur existe
    const vendor = await User.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ 
        error: 'Vendeur non trouvé' 
      });
    }

    // Créer la précommande
    const preorder = new Preorder({
      productId,
      vendorId,
      quantity,
      customerName,
      phone
    });

    const savedPreorder = await preorder.save();
    
    res.status(201).json(savedPreorder);
  } catch (error) {
    console.error('Erreur création précommande:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la création de la précommande' 
    });
  }
};

// 2. Récupérer les précommandes (avec filtres)
const getPreorders = async (req, res) => {
  try {
    const { vendorId, status } = req.query;
    const filter = {};

    // Filtre par vendeur
    if (vendorId) {
      if (!isValidObjectId(vendorId)) {
        return res.status(400).json({ 
          error: 'ID vendeur invalide' 
        });
      }
      filter.vendorId = vendorId;
    }

    // Filtre par statut
    if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) {
      filter.status = status;
    }

    // Récupérer les précommandes avec les données du produit
    const preorders = await Preorder.find(filter)
      .populate('productId', 'name brand price')
      .sort({ createdAt: -1 });

    res.json(preorders);
  } catch (error) {
    console.error('Erreur récupération précommandes:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la récupération des précommandes' 
    });
  }
};

// 3. Mettre à jour le statut d'une précommande
const updatePreorderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation de l'ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        error: 'ID de précommande invalide' 
      });
    }

    // Validation du statut
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        error: 'Statut invalide. Valeurs autorisées: pending, confirmed, cancelled' 
      });
    }

    // Mettre à jour la précommande
    const preorder = await Preorder.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('productId', 'name brand price');

    if (!preorder) {
      return res.status(404).json({ 
        error: 'Précommande non trouvée' 
      });
    }

    res.json(preorder);
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la mise à jour du statut' 
    });
  }
};

// 4. Endpoint de debug/test
const debugPreorder = async (req, res) => {
  try {
    const { productId, vendorId, quantity, customerName, phone } = req.body;

    // Validation des données
    const validation = {
      productIdValid: isValidObjectId(productId),
      vendorIdValid: isValidObjectId(vendorId),
      productExists: false,
      vendorExists: false
    };

    // Vérifier l'existence du produit
    if (validation.productIdValid) {
      const product = await Product.findById(productId);
      validation.productExists = !!product;
    }

    // Vérifier l'existence du vendeur
    if (validation.vendorIdValid) {
      const vendor = await User.findById(vendorId);
      validation.vendorExists = !!vendor;
    }

    res.json({
      validation,
      data: {
        productId,
        vendorId,
        quantity,
        customerName,
        phone
      }
    });
  } catch (error) {
    console.error('Erreur debug précommande:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors du debug' 
    });
  }
};

// 5. Récupérer une précommande par ID
const getPreorderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        error: 'ID de précommande invalide' 
      });
    }

    const preorder = await Preorder.findById(id)
      .populate('productId', 'name brand price')
      .populate('vendorId', 'username email');

    if (!preorder) {
      return res.status(404).json({ 
        error: 'Précommande non trouvée' 
      });
    }

    res.json(preorder);
  } catch (error) {
    console.error('Erreur récupération précommande:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la récupération de la précommande' 
    });
  }
};

module.exports = {
  createPreorder,
  getPreorders,
  updatePreorderStatus,
  debugPreorder,
  getPreorderById
};
