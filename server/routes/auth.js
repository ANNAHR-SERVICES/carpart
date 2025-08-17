const express = require('express');
const router = express.Router();
const { signUp, signIn, superadminCreateUser, testAuth } = require('../controllers/authController');
const { authenticateJWT, requireSuperadmin, authorizeRoles } = require('../middleware/auth');

// Public routes - anyone can access
router.post('/signup', signUp);
router.post('/signin', signIn);

// Protected routes - require authentication and specific roles
// Only superadmin can create users with special roles
router.post('/create-user', authenticateJWT, requireSuperadmin, superadminCreateUser);

// Test routes for debugging middleware
router.get('/test-auth', authenticateJWT, testAuth);
router.get('/test-superadmin', authenticateJWT, requireSuperadmin, testAuth);
router.get('/test-admin', authenticateJWT, authorizeRoles('admin', 'superadmin'), testAuth);
router.get('/test', authenticateJWT, testAuth);

// Additional protected routes can be added here
// Example: router.get('/users', authenticateJWT, authorizeRoles('admin', 'superadmin'), userController.getAllUsers);

module.exports = router;
