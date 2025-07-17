const express = require('express');
const router = express.Router();
const { reserverPiece } = require('../controllers/acheteurController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/reserver', auth, role('acheteur'), reserverPiece);

module.exports = router; 