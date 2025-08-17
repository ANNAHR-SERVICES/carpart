const express = require('express');
const router = express.Router();
const { reserverPiece } = require('../controllers/acheteurController');
const { authenticateJWT } = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/reserver', authenticateJWT, role('acheteur'), reserverPiece);

module.exports = router; 