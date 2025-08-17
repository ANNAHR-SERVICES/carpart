const express = require('express');
const router = express.Router();
const { reserverPiece, validateQRCode } = require('../controllers/acheteurController');
const { authenticateJWT } = require('../middleware/auth');

router.post('/reserverPiece', authenticateJWT, reserverPiece);

// Nouvelle route pour validation QR code
router.post('/validateQRCode', authenticateJWT, validateQRCode);

module.exports = router;