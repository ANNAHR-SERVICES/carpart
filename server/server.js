const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
// Import controllers et middlewares nécessaires
const authController = require('./controllers/authController');
const { authenticateJWT, requireSuperadmin, authorizeRoles } = require('./middleware/auth');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://Adam:Adam123@autosparepartsplatform.rvlewlb.mongodb.net/?retryWrites=true&w=majority&appName=AutoSparePartsPlatform';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// =========================
// Auth Routes directement ici
// =========================
// Public routes - anyone can access
app.post('/api/auth/signup', authController.signUp);
app.post('/api/auth/signin', authController.signIn);

// Protected routes - require authentication and specific roles
// Only superadmin can create users with special roles
app.post('/api/auth/create-user', authenticateJWT, requireSuperadmin, authController.superadminCreateUser);

// Test routes for debugging middleware
app.get('/api/auth/test-auth', authenticateJWT, authController.testAuth);
app.get('/api/auth/test-superadmin', authenticateJWT, requireSuperadmin, authController.testAuth);
app.get('/api/auth/test-admin', authenticateJWT, authorizeRoles('admin', 'superadmin'), authController.testAuth);

// Example protected route (only admin or superadmin)
app.get('/api/protected/admin', authenticateJWT, authorizeRoles('admin', 'superadmin'), (req, res) => {
  res.json({ message: 'You are an admin or superadmin.' });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Auto Spare Parts Platform API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
}); 