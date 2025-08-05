const express = require('express');
const router = express.Router();

// exemple de route test
router.get('/', (req, res) => {
  res.send('Vendeur route OK');
});

module.exports = router;
