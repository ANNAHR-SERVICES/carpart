const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const vendeurRoutes = require('./routes/vendeur');
const acheteurRoutes = require('./routes/acheteur');

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globaux
app.use(express.json());
app.use(cors());

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://Adam:Adam123@autosparepartsplatform.rvlewlb.mongodb.net/?retryWrites=true&w=majority&appName=AutoSparePartsPlatform';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ===== ROUTES =====
// Branche les routes
app.use('/api/auth', authRoutes); // Auth routes with /api/auth prefix
app.use('/api/products', productRoutes);
app.use('/api/vendeur', vendeurRoutes);
app.use('/api/acheteur', acheteurRoutes);

// Example protected route (only admin or superadmin)
const { authenticateJWT, authorizeRoles } = require('./middleware/auth');
app.get('/api/protected/admin', authenticateJWT, authorizeRoles('admin', 'superadmin'), (req, res) => {
  res.json({ message: 'You are an admin or superadmin.' });
});

// Route de test (optionnelle)
app.get('/', (req, res) => {
  res.send('API Backend CarPart 🚗🔧');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur actif sur le port ${PORT}`);
});
