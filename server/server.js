const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const preorderRoutes = require('./routes/preorders');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://Adam:Adam123@autosparepartsplatform.rvlewlb.mongodb.net/?retryWrites=true&w=majority&appName=AutoSparePartsPlatform';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/preorders', preorderRoutes);

// Example protected route (only admin or superadmin)
const { authenticateJWT, authorizeRoles } = require('./middleware/auth');
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