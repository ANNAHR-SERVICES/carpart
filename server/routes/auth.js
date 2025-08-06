const express = require('express');
const router = express.Router();
const { signUp, signIn, superadminCreateUser, testAuth } = require('../controllers/authController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Public routes
router.post('/signup', signUp);
router.post('/signin', signIn);

// Protected routes
router.post('/create-user', authenticateJWT, authorizeRoles('superadmin'), superadminCreateUser);
router.get('/test', authenticateJWT, testAuth);

module.exports = router;
