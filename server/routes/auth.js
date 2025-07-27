const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateJWT, requireSuperadmin, authorizeRoles } = require('../middleware/auth');

// Public routes - anyone can access
router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);

// Protected routes - require authentication and specific roles
// Only superadmin can create users with special roles
router.post('/create-user', authenticateJWT, requireSuperadmin, authController.superadminCreateUser);

// Test routes for debugging middleware
router.get('/test-auth', authenticateJWT, authController.testAuth);
router.get('/test-superadmin', authenticateJWT, requireSuperadmin, authController.testAuth);
router.get('/test-admin', authenticateJWT, authorizeRoles('admin', 'superadmin'), authController.testAuth);

// Additional protected routes can be added here
// Example: router.get('/users', authenticateJWT, authorizeRoles('admin', 'superadmin'), userController.getAllUsers);

module.exports = router; 