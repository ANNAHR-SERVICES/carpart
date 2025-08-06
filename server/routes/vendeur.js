const express = require('express');
const router = express.Router();
const Piece = require('../models/Piece');
const { authenticateJWT } = require('../middleware/auth');

// Route pour créer une pièce (pour les tests)
router.post('/pieces', async (req, res) => {
  try {
    const { nom, description, prix, stock, vendeurId } = req.body;
    const piece = new Piece({
      nom,
      description,
      prix,
      vendeurId,
      stock,
      disponibilite: stock > 0
    });
    await piece.save();
    res.status(201).json({ message: 'Pièce créée avec succès', piece });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la pièce', error: error.message });
  }
});

// Route pour lister les pièces
router.get('/pieces', async (req, res) => {
  try {
    const pieces = await Piece.find({ disponibilite: true });
    res.json(pieces);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des pièces', error: error.message });
  }
});

module.exports = router;
