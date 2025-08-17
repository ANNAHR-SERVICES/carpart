const express = require('express');
const router = express.Router();
const Piece = require('../models/Piece');
const { authenticateJWT } = require('../middleware/auth');

// ===== ROUTES CRUD COMPLÈTES =====

// 1. Créer un produit
router.post('/pieces', authenticateJWT, async (req, res) => {
  try {
    const { nom, description, prix, stock, categorie, marque, modele, annee } = req.body;
    const vendeurId = req.user.userId;

    const piece = new Piece({
      nom,
      description,
      prix,
      stock,
      vendeurId,
      categorie,
      marque,
      modele,
      annee,
      disponibilite: stock > 0
    });

    await piece.save();
    res.status(201).json({ 
      message: 'Produit créé avec succès', 
      piece 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la création du produit', 
      error: error.message 
    });
  }
});

// 2. Lister tous les produits (avec pagination)
router.get('/pieces', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, prixMin, prixMax, categorie } = req.query;
    const skip = (page - 1) * limit;

    let query = { disponibilite: true };

    // Recherche par nom et description
    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtrage par prix
    if (req.query.prixMin || req.query.prixMax) {
      query.prix = {};
      if (req.query.prixMin) query.prix.$gte = parseFloat(req.query.prixMin);
      if (req.query.prixMax) query.prix.$lte = parseFloat(req.query.prixMax);
    }

    // Filtrage par catégorie
    if (categorie) {
      query.categorie = categorie;
    }

    // Filtrage par marque
    if (req.query.marque) {
      query.marque = { $regex: req.query.marque, $options: 'i' };
    }

    // Filtrage par modèle
    if (req.query.modele) {
      query.modele = { $regex: req.query.modele, $options: 'i' };
    }

    // Filtrage par année
    if (req.query.annee) {
      query.annee = parseInt(req.query.annee);
    }

    // Filtrage par disponibilité
    if (req.query.disponibilite !== undefined) {
      query.disponibilite = req.query.disponibilite === 'true';
    }

    // Tri avec options avancées
    let sortOption = { dateAjout: -1 }; // Par défaut, tri par date décroissante
    if (req.query.tri) {
      switch (req.query.tri) {
        case 'prix_asc':
          sortOption = { prix: 1 };
          break;
        case 'prix_desc':
          sortOption = { prix: -1 };
          break;
        case 'nom_asc':
          sortOption = { nom: 1 }; // Tri alphabétique croissant (ignore majuscules/minuscules)
          break;
        case 'nom_desc':
          sortOption = { nom: -1 }; // Tri alphabétique décroissant (ignore majuscules/minuscules)
          break;
        case 'nom_asc_strict':
          // Tri alphabétique strict avec contrôle total
          sortOption = { nom: 1 };
          break;
        case 'nom_desc_strict':
          // Tri alphabétique strict inverse avec contrôle total
          sortOption = { nom: -1 };
          break;
        case 'date_asc':
          sortOption = { dateAjout: 1 };
          break;
        case 'date_desc':
          sortOption = { dateAjout: -1 };
          break;
        case 'marque_asc':
          sortOption = { marque: 1 }; // Tri par marque alphabétique
          break;
        case 'marque_desc':
          sortOption = { marque: -1 }; // Tri par marque alphabétique inverse
          break;
        case 'categorie_asc':
          sortOption = { categorie: 1 }; // Tri par catégorie alphabétique
          break;
        case 'categorie_desc':
          sortOption = { categorie: -1 }; // Tri par catégorie alphabétique inverse
          break;
      }
    }

    // Vérifier si on utilise un tri strict
    const useStrictSort = req.query.tri && req.query.tri.includes('strict');
    
    let pieces;
    if (useStrictSort) {
      // Utiliser l'agrégation pour un tri alphabétique strict
      const pipeline = [
        { $match: query },
        {
          $addFields: {
            nomLower: { $toLower: "$nom" }  // Convertir en minuscules pour le tri
          }
        },
        { 
          $sort: { 
            nomLower: req.query.tri === 'nom_asc_strict' ? 1 : -1 
          } 
        },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ];
      
      pieces = await Piece.aggregate(pipeline);
    } else {
      // Configuration du tri normal avec collation
      let findOptions = {
        skip: skip,
        limit: parseInt(limit),
        sort: sortOption
      };

      // Ajouter la collation pour ignorer majuscules/minuscules sur tous les tris alphabétiques
      if (req.query.tri && (req.query.tri.includes('nom') || req.query.tri.includes('marque') || req.query.tri.includes('categorie'))) {
        findOptions.collation = { 
          locale: 'fr', 
          strength: 2,  // strength: 2 ignore la casse
          numericOrdering: true  // Assure l'ordre numérique correct
        };
      }

      pieces = await Piece.find(query, null, findOptions);
    }

    const total = await Piece.countDocuments(query);

    res.json({
      pieces,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des produits', 
      error: error.message 
    });
  }
});

// 3. Obtenir un produit spécifique
router.get('/pieces/:id', async (req, res) => {
  try {
    const piece = await Piece.findById(req.params.id);
    if (!piece) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json(piece);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du produit', 
      error: error.message 
    });
  }
});

// 4. Modifier un produit
router.put('/pieces/:id', authenticateJWT, async (req, res) => {
  try {
    const { nom, description, prix, stock, categorie, marque, modele, annee } = req.body;
    const vendeurId = req.user.userId;

    const piece = await Piece.findById(req.params.id);
    if (!piece) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Vérifier que le vendeur est propriétaire du produit
    if (piece.vendeurId.toString() !== vendeurId) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const updatedPiece = await Piece.findByIdAndUpdate(
      req.params.id,
      {
        nom,
        description,
        prix,
        stock,
        categorie,
        marque,
        modele,
        annee,
        disponibilite: stock > 0
      },
      { new: true }
    );

    res.json({ 
      message: 'Produit modifié avec succès', 
      piece: updatedPiece 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la modification du produit', 
      error: error.message 
    });
  }
});

// 5. Supprimer un produit
router.delete('/pieces/:id', authenticateJWT, async (req, res) => {
  try {
    const vendeurId = req.user.userId;
    const piece = await Piece.findById(req.params.id);
    
    if (!piece) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Vérifier que le vendeur est propriétaire du produit
    if (piece.vendeurId.toString() !== vendeurId) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    await Piece.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du produit', 
      error: error.message 
    });
  }
});

// ===== ROUTES AVANCÉES =====

// Recherche de produits
router.get('/pieces/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const pieces = await Piece.find({
      $or: [
        { nom: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { marque: { $regex: query, $options: 'i' } },
        { modele: { $regex: query, $options: 'i' } }
      ],
      disponibilite: true
    });
    res.json(pieces);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la recherche', 
      error: error.message 
    });
  }
});

// Produits par catégorie
router.get('/pieces/categorie/:categorie', async (req, res) => {
  try {
    const { categorie } = req.params;
    const pieces = await Piece.find({ 
      categorie: { $regex: categorie, $options: 'i' },
      disponibilite: true 
    });
    res.json(pieces);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération par catégorie', 
      error: error.message 
    });
  }
});

module.exports = router;
