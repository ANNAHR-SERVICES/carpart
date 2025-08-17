# 📋 Documentation CarPart - Système de Gestion de Pièces Automobiles

## 🎯 Vue d'ensemble du projet

CarPart est une application web complète pour la gestion et la vente de pièces automobiles, comprenant :
- **Backend** : API REST avec Node.js/Express/MongoDB
- **Frontend** : Interface React avec authentification et gestion des rôles
- **Fonctionnalités** : Gestion des produits, réservations, QR codes, recherche avancée

---

## 🏗️ Architecture du système

### **Structure des dossiers :**
```
carpart/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants UI
│   │   ├── pages/         # Pages principales
│   │   ├── services/      # Services API
│   │   ├── context/       # Context React
│   │   └── styles/        # Styles CSS
├── server/                # Backend Node.js
│   ├── controllers/       # Logique métier
│   ├── models/           # Modèles MongoDB
│   ├── routes/           # Routes API
│   ├── middleware/       # Middleware d'authentification
│   └── config/           # Configuration
└── docs/                 # Documentation
```

---

## 🔐 Système d'authentification et rôles

### **Rôles utilisateurs :**
- **`client`** : Clients finaux (inscription publique)
- **`acheteur`** : Acheteurs (inscription publique)
- **`vendeur`** : Vendeurs de pièces
- **`admin`** : Administrateurs
- **`moderateur`** : Modérateurs
- **`superadmin`** : Super administrateurs

### **Flux d'authentification :**
1. **Inscription** : `/api/auth/signup` (POST)
2. **Connexion** : `/api/auth/signin` (POST)
3. **JWT Token** : Authentification Bearer
4. **Autorisation** : Middleware par rôle

---

## 🛍️ API de Gestion des Produits

### **Endpoints principaux :**

#### **GET /api/vendeur/pieces**
**Description :** Récupérer la liste des produits avec filtres et pagination

**Paramètres de requête :**
```javascript
{
  page: 1,                    // Page actuelle
  limit: 10,                   // Nombre d'éléments par page
  search: "frein",             // Recherche textuelle
  categorie: "freinage",       // Filtre par catégorie
  marque: "Toyota",           // Filtre par marque
  modele: "Corolla",          // Filtre par modèle
  annee: 2020,                // Filtre par année
  prixMin: 10,                // Prix minimum
  prixMax: 100,               // Prix maximum
  disponibilite: true,        // Disponibilité
  tri: "date_desc"            // Tri (date_desc, prix_asc, etc.)
}
```

**Réponse :**
```javascript
{
  "pieces": [
    {
      "_id": "6894fd7a2c790808cb74334d",
      "nom": "Plaquette de frein",
      "description": "Plaquette de frein avant droite",
      "prix": 45.99,
      "stock": 5,
      "categorie": "freinage",
      "marque": "Toyota",
      "modele": "Corolla",
      "annee": 2020,
      "disponibilite": true,
      "dateAjout": "2025-08-07T19:52:22.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### **POST /api/vendeur/pieces**
**Description :** Créer un nouveau produit

**Corps de la requête :**
```javascript
{
  "nom": "Plaquette de frein",
  "description": "Plaquette de frein avant droite",
  "prix": 45.99,
  "stock": 5,
  "categorie": "freinage",
  "marque": "Toyota",
  "modele": "Corolla",
  "annee": 2020,
  "images": ["url1", "url2"],
  "specifications": {
    "matiere": "céramique",
    "compatibilite": "Toyota Corolla 2020-2023"
  }
}
```

#### **PUT /api/vendeur/pieces/:id**
**Description :** Mettre à jour un produit

#### **DELETE /api/vendeur/pieces/:id**
**Description :** Supprimer un produit

#### **GET /api/vendeur/pieces/search/:query**
**Description :** Recherche textuelle avancée

#### **GET /api/vendeur/pieces/categorie/:categorie**
**Description :** Filtrer par catégorie

---

## 🛒 Système de Réservation

### **Endpoint de réservation :**

#### **POST /api/acheteur/reserverPiece**
**Description :** Réserver une pièce automobile

**Headers requis :**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Corps de la requête :**
```javascript
{
  "pieceId": "6894fd7a2c790808cb74334d",
  "quantite": 2,
  "dateReservation": "2025-08-07T20:00:00.000Z",
  "commentaire": "Besoin urgent pour réparation"
}
```

**Réponse réussie :**
```javascript
{
  "message": "Réservation créée avec succès",
  "reservation": {
    "_id": "6894fd8a2c790808cb74334e",
    "acheteurId": "6892c8b2d54ab946162258e4",
    "pieceId": "6894fd7a2c790808cb74334d",
    "quantite": 2,
    "statut": "en_attente",
    "dateReservation": "2025-08-07T20:00:00.000Z",
    "dateCreation": "2025-08-07T19:52:22.000Z"
  }
}
```

**Codes d'erreur possibles :**
- `400` : Données invalides
- `401` : Token manquant ou invalide
- `403` : Accès refusé (rôle acheteur requis)
- `404` : Pièce non trouvée
- `409` : Stock insuffisant

---

## 📱 Interface Frontend

### **Pages principales :**

#### **1. Page de connexion** (`/signin`)
- Formulaire de connexion
- Redirection automatique selon le rôle
- Gestion des erreurs avec toast notifications

#### **2. Dashboard Client** (`/client/dashboard`)
- Vue d'ensemble pour les clients
- Carte "Browse Parts" cliquable
- Navigation vers la recherche de produits

#### **3. Interface de recherche** (`/products`)
- **Filtres avancés :**
  - Recherche textuelle
  - Filtre par catégorie
  - Filtre par marque/modèle/année
  - Filtre par prix (min/max)
  - Filtre par disponibilité
  - Options de tri

- **Affichage des produits :**
  - Cards produit avec image
  - Prix en TND (Dinar tunisien)
  - Informations détaillées (stock, catégorie, etc.)
  - Pagination
  - États de chargement

### **Composants React :**

#### **ProductSearch.js**
```javascript
// Fonctionnalités principales
- Gestion d'état avec useState/useEffect
- Appel API avec Axios
- Filtres dynamiques
- Pagination
- Formatage des prix en TND
- Gestion des erreurs avec toast
```

#### **Dashboard.js**
```javascript
// Dashboards par rôle
- ClientDashboard : Navigation vers recherche
- VendeurDashboard : Gestion des produits
- AdminDashboard : Gestion des utilisateurs
- ModerateurDashboard : Modération
- SuperadminDashboard : Création d'utilisateurs
```

---

## 🔧 Configuration et Installation

### **Variables d'environnement :**

#### **Backend** (`.env`)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/carpart
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

#### **Frontend** (`.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### **Installation :**

#### **Backend :**
```bash
cd server
npm install
npm start
```

#### **Frontend :**
```bash
cd client
npm install
npm start
```

---

## 🧪 Tests et Validation

### **Tests API avec Thunder Client :**

#### **1. Test d'inscription :**
```http
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "acheteur"
}
```

#### **2. Test de connexion :**
```http
POST http://localhost:5000/api/auth/signin
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### **3. Test de récupération des produits :**
```http
GET http://localhost:5000/api/vendeur/pieces?page=1&limit=5
```

#### **4. Test de réservation :**
```http
POST http://localhost:5000/api/acheteur/reserverPiece
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "pieceId": "6894fd7a2c790808cb74334d",
  "quantite": 1
}
```

---

## 🚀 Fonctionnalités avancées

### **1. Système de QR Code (À implémenter)**
```javascript
// Génération de QR code pour les réservations
const generateQRCode = (reservationId) => {
  const qrData = {
    reservationId,
    timestamp: Date.now(),
    url: `${process.env.FRONTEND_URL}/reservation/${reservationId}`
  };
  return QRCode.toDataURL(JSON.stringify(qrData));
};
```

### **2. Notifications en temps réel**
```javascript
// WebSocket pour les notifications
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
  });
});
```

### **3. Système de paiement**
```javascript
// Intégration Stripe/PayPal
const processPayment = async (reservationId, amount) => {
  // Logique de paiement
};
```

---

## 📊 Base de données

### **Modèles MongoDB :**

#### **User.js**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum),
  createdAt: Date
}
```

#### **Piece.js**
```javascript
{
  nom: String,
  description: String,
  prix: Number,
  stock: Number,
  vendeurId: ObjectId,
  disponibilite: Boolean,
  categorie: String (enum),
  marque: String,
  modele: String,
  annee: Number,
  images: [String],
  specifications: Map,
  dateAjout: Date,
  dateModification: Date
}
```

#### **Reservation.js**
```javascript
{
  acheteurId: ObjectId,
  pieceId: ObjectId,
  quantite: Number,
  statut: String (enum),
  dateReservation: Date,
  dateCreation: Date
}
```

---

## 🔒 Sécurité

### **Mesures de sécurité implémentées :**
- ✅ **Hachage des mots de passe** avec bcryptjs
- ✅ **JWT tokens** pour l'authentification
- ✅ **Validation des données** avec Mongoose
- ✅ **CORS** configuré
- ✅ **Middleware d'autorisation** par rôle
- ✅ **Validation des entrées** côté serveur

### **Bonnes pratiques :**
- ✅ **Variables d'environnement** pour les secrets
- ✅ **Gestion d'erreurs** centralisée
- ✅ **Logs** pour le debugging
- ✅ **Validation côté client et serveur**

---

## 📈 Évolutions futures

### **Fonctionnalités prévues :**
1. **Système de QR Code** pour les réservations
2. **Notifications push** en temps réel
3. **Système de paiement** intégré
4. **Gestion des images** avec upload
5. **API mobile** pour applications natives
6. **Analytics** et rapports avancés
7. **Système de recommandations**
8. **Chat en temps réel** entre acheteurs et vendeurs

---

## 📞 Support et Contact

### **En cas de problème :**
1. **Vérifiez les logs** du serveur
2. **Testez les endpoints** avec Thunder Client
3. **Vérifiez la console** du navigateur
4. **Consultez la documentation** MongoDB

### **Développement :**
- **Backend** : Node.js, Express, MongoDB
- **Frontend** : React, Axios, React Router
- **Authentification** : JWT, bcryptjs
- **UI/UX** : CSS moderne, responsive design

---

*Documentation mise à jour le : 07/08/2025*
*Version : 1.0.0* 