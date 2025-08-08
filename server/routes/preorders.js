const express = require('express');
const router = express.Router();
const {
  createPreorder,
  getPreorders,
  updatePreorderStatus,
  debugPreorder,
  getPreorderById
} = require('../controllers/preorderController');

// Middleware d'authentification (à implémenter si nécessaire)
// const auth = require('../middleware/auth');

// Routes pour les précommandes

// POST /api/preorders - Créer une précommande
router.post('/', createPreorder);

// GET /api/preorders - Récupérer les précommandes (avec filtres)
router.get('/', getPreorders);

// GET /api/preorders/:id - Récupérer une précommande par ID
router.get('/:id', getPreorderById);

// PATCH /api/preorders/:id/status - Mettre à jour le statut
router.patch('/:id/status', updatePreorderStatus);

// POST /api/preorders/debug - Endpoint de debug/test
router.post('/debug', debugPreorder);

module.exports = router;
