const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// Créer un nouveau produit avec images
const createProduct = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    // Extraire les données du produit
    const {
      name,
      description,
      price,
      category,
      brand,
      model,
      year,
      condition,
      stock
    } = req.body;

    // Créer le nouveau produit
    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      brand,
      model,
      year: parseInt(year),
      condition,
      stock: parseInt(stock),
      images: req.body.images, // URLs des images uploadées
      seller: req.user.userId // ID de l'utilisateur connecté
    });

    // Sauvegarder le produit
    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: savedProduct
    });

  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du produit'
    });
  }
};

// Obtenir tous les produits
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, brand, search } = req.query;
    
    // Construire le filtre
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(filter)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des produits'
    });
  }
};

// Obtenir un produit par ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email phone');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du produit'
    });
  }
};

// Mettre à jour un produit
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire du produit
    if (product.seller.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    // Mettre à jour les champs
    const updateFields = { ...req.body };
    
    // Si de nouvelles images sont uploadées, les ajouter
    if (req.body.images && req.body.images.length > 0) {
      updateFields.images = req.body.images;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Produit mis à jour avec succès',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du produit'
    });
  }
};

// Supprimer un produit (soft delete)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire du produit
    if (product.seller.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    // Soft delete
    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Produit supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du produit'
    });
  }
};

// Obtenir les produits d'un vendeur
const getSellerProducts = async (req, res) => {
  try {
    console.log('[getSellerProducts] user:', req.user);
    if (!req.user || !req.user.userId) {
      console.error('[getSellerProducts] Pas d\'utilisateur authentifié');
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
    }
    const products = await Product.find({ 
      seller: req.user.userId,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('[getSellerProducts] Erreur lors de la récupération des produits du vendeur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des produits',
      error: error.message
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getSellerProducts
}; 