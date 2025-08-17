const express = require('express');
const router = express.Router();
const partsController = require('../controllers/partsController');

router.get('/search', partsController.searchParts);

module.exports = router;
