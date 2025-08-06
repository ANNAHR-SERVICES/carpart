const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globaux
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connecté à MongoDB');
}).catch((err) => {
  console.error('❌ Erreur MongoDB :', err);
});

// ===== ROUTES =====
const authRoutes = require('./routes/auth');
const vendeurRoutes = require('./routes/vendeur');
const acheteurRoutes = require('./routes/acheteur');

// Branche les routes
app.use('/api/auth', authRoutes); // Auth routes with /api/auth prefix
app.use('/api/vendeur', vendeurRoutes);
app.use('/api/acheteur', acheteurRoutes);

// Route de test (optionnelle)
app.get('/', (req, res) => {
  res.send('API Backend CarPart 🚗🔧');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur actif sur le port ${PORT}`);
});
