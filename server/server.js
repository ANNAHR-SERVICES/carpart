const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authController = require('./controllers/authController');
const partsRoutes = require('./routes/car_parts');
const { authenticateJWT, requireSuperadmin, authorizeRoles } = require('./middleware/auth');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI = 'mongodb+srv://bayfiras:bayfiras150302@carpart.c1hq0el.mongodb.net/carpartdb?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.post('/api/auth/signup', authController.signUp);
app.post('/api/auth/signin', authController.signIn);

app.post('/api/auth/create-user', authenticateJWT, requireSuperadmin, authController.superadminCreateUser);

app.get('/api/auth/test-auth', authenticateJWT, authController.testAuth);
app.get('/api/auth/test-superadmin', authenticateJWT, requireSuperadmin, authController.testAuth);
app.get('/api/auth/test-admin', authenticateJWT, authorizeRoles('admin', 'superadmin'), authController.testAuth);

app.get('/api/protected/admin', authenticateJWT, authorizeRoles('admin', 'superadmin'), (req, res) => {
    res.json({ message: 'You are an admin or superadmin.' });
});

app.use('/api/parts', partsRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Auto Spare Parts Platform API' });
});

app.get('/test', (req, res) => {
    res.json({ message: 'Hello World' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}`);
});