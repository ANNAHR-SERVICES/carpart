# CARPART

# 🧩 Autoparts Platform – MERN Stack

A modular and scalable full-stack web platform for managing auto parts, built with the **MERN stack** (MongoDB, Express.js, React, Node.js).

---

## ✅ Features Implemented (Initial Release)

- 🔐 **User Authentication**
  - Sign Up (with validation and error handling)
  - Sign In (with JWT-based session handling)
- 👤 **Roles Management**
  - Admin and User role-based access control (RBAC)
  - Role middleware for protected routes

---

## 🚀 Tech Stack

| Frontend  | Backend     | Database  | Auth         |
|-----------|-------------|-----------|--------------|
| React     | Node + Express | MongoDB   | JWT / Bcrypt |

---

## 🔧 Project Root Structure

```bash
carpart/
├── client/                 # React Frontend
├── server/                 # Node.js + Express Backend
├── .gitignore
└── README.md
```


## 📁 Client Structure (/client)
This is your React app folder.

```bash
client/
├── public/
│   └── index.html
├── src/
│   ├── assets/             # Images, styles, etc.
│   ├── components/         # Reusable UI components
│   ├── context/            
│   ├── pages/              # Route-based components (e.g., Home, Login)
│   ├── routes/             # React Router config
│   ├── services/           # API calls (axios/fetch)
│   ├── App.js
│   ├── index.js
│   └── styles/             # Global styles (optional)
│       └── app.css
│       └── index.css
├── .env                    # React env variables
├── package.json
└── README.md
```


## 📁 Server Structure (/server)
This is your Express.js backend with MongoDB (via Mongoose).

```bash
server/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/            # Logic for routes
│   └── userController.js
├── middleware/             # Auth, error handling, etc.
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/                 # Mongoose schemas
│   └── User.js
├── routes/                 # Express routes
│   └── userRoutes.js
├── utils/                  # Helper functions
├── .env                    # Server environment variables
├── server.js               # Entry point
├── package.json
└── README.md
```

---

## 📋 Tâches Accomplies

### ✅ **1. Correction du système d'authentification**
- **Problème** : Erreur lors de l'inscription
- **Solution** : Correction des routes et contrôleurs
- **Fichiers modifiés** :
  - `server/routes/auth.js` - Ajout des routes signup/signin
  - `server/controllers/authController.js` - Logique d'authentification
  - `server/models/User.js` - Ajout du rôle 'acheteur'
  - `server/server.js` - Configuration des routes API

### ✅ **2. Système de réservation**
- **Fonctionnalité** : Réservation de pièces automobiles
- **Fichiers créés/modifiés** :
  - `server/controllers/acheteurController.js` - Logique de réservation
  - `server/routes/acheteur.js` - Routes de réservation
  - `server/models/Reservation.js` - Modèle de réservation
- **Tests** : Validation avec Thunder Client

### ✅ **3. API de gestion des produits**
- **Fonctionnalités** : CRUD complet avec filtres avancés
- **Fichiers modifiés** :
  - `server/routes/vendeur.js` - Endpoints produits
  - `server/models/Piece.js` - Modèle produit étendu
- **Filtres implémentés** :
  - Recherche textuelle
  - Filtrage par catégorie, marque, modèle, année
  - Filtrage par prix (min/max)
  - Tri et pagination

### ✅ **4. Interface de recherche frontend**
- **Composant** : ProductSearch avec filtres dynamiques
- **Fichiers créés** :
  - `client/src/components/ProductSearch.js` - Interface de recherche
  - `client/src/components/ProductSearch.css` - Styles
- **Fonctionnalités** :
  - Filtres en temps réel
  - Affichage en grille des produits
  - Pagination
  - Prix en TND (Dinar tunisien)

### ✅ **5. Navigation et dashboard**
- **Fonctionnalité** : Dashboard client avec navigation
- **Fichiers modifiés** :
  - `client/src/pages/Dashboard.js` - Ajout de la navigation
  - `client/src/pages/Dashboard.css` - Styles pour cartes cliquables
- **Fonctionnalités** :
  - Carte "Browse Parts" cliquable
  - Redirection vers l'interface de recherche

### ✅ **6. Configuration Git et ESLint**
- **Fichiers créés** :
  - `.gitattributes` - Configuration des fins de ligne
  - Configuration ESLint pour éviter les warnings
- **Corrections** :
  - Warnings ESLint résolus
  - Configuration Git pour Windows

### ✅ **7. Documentation complète**
- **Fichiers créés** :
  - `DOCUMENTATION.md` - Documentation technique complète
  - `QR_CODE_IMPLEMENTATION.md` - Guide QR Code
  - `README.md` - Documentation principale mise à jour

---

## 🧪 Tests Réalisés

### **Tests API avec Thunder Client**
1. ✅ **Inscription** : `POST /api/auth/signup`
2. ✅ **Connexion** : `POST /api/auth/signin`
3. ✅ **Récupération produits** : `GET /api/vendeur/pieces`
4. ✅ **Réservation** : `POST /api/acheteur/reserverPiece`

### **Tests Frontend**
1. ✅ **Interface de recherche** : `http://localhost:3000/products`
2. ✅ **Dashboard client** : `http://localhost:3000/client/dashboard`
3. ✅ **Navigation** : Carte "Browse Parts" fonctionnelle
4. ✅ **Filtres** : Tous les filtres opérationnels

---

## 🔧 Configuration

### **Variables d'environnement**
```env
# Backend (.env)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/carpart
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

### **Installation**
```bash
# Backend
cd server
npm install
npm start

# Frontend
cd client
npm install
npm start
```

---

## 📊 Fonctionnalités Implémentées

### **Backend**
- ✅ Authentification JWT
- ✅ Gestion des rôles (client, acheteur, vendeur, admin, moderateur, superadmin)
- ✅ API CRUD produits avec filtres avancés
- ✅ Système de réservation avec validation
- ✅ Pagination et tri
- ✅ Validation des données

### **Frontend**
- ✅ Interface de recherche responsive
- ✅ Filtres dynamiques
- ✅ Dashboard par rôle
- ✅ Navigation intuitive
- ✅ Prix en TND
- ✅ Notifications toast

### **Base de données**
- ✅ Modèle User avec rôles
- ✅ Modèle Piece avec métadonnées
- ✅ Modèle Reservation
- ✅ Index pour performance

---

## 🚀 Prochaines étapes

### **Fonctionnalités prévues**
1. **Système de QR Code** pour les réservations
2. **Notifications push** en temps réel
3. **Système de paiement** intégré
4. **Gestion des images** avec upload
5. **API mobile** pour applications natives

---

*Projet développé avec ❤️ pour la gestion de pièces automobiles*

**Version :** 1.0.0  
**Dernière mise à jour :** 07/08/2025 