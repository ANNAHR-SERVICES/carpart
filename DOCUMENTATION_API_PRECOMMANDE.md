# Documentation API - Module de Précommande

## 📋 Vue d'ensemble

Ce document décrit le module de précommande développé pour la plateforme Auto Spare Parts, incluant le backend avec stockage MongoDB et l'interface vendeur React.

## 🏗️ Architecture Backend

### Structure du Module Précommande

```
carpart/server/
├── models/
│   └── Preorder.js          # Modèle MongoDB
├── controllers/
│   └── preorderController.js # Logique métier
├── routes/
│   └── preorders.js         # Définition des endpoints
└── server.js                # Configuration serveur
```

### Modèle de Données (Preorder.js)

```javascript
{
  productId: ObjectId,      // Référence vers Product
  vendorId: ObjectId,       // Référence vers User (vendeur)
  quantity: Number,         // Quantité commandée
  customerName: String,     // Nom du client
  phone: String,           // Téléphone du client
  status: String,          // 'pending' | 'confirmed' | 'cancelled'
  createdAt: Date          // Date de création
}
```

## 🔌 Endpoints API Précommande

### Base URL
```
http://localhost:5000/api/preorders
```

### 1. Créer une Précommande
```http
POST /api/preorders
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "vendorId": "507f1f77bcf86cd799439012",
  "quantity": 2,
  "customerName": "Ahmed Ben Ali",
  "phone": "+216 71 234 567"
}
```

**Réponse Succès (201):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "productId": "507f1f77bcf86cd799439011",
  "vendorId": "507f1f77bcf86cd799439012",
  "quantity": 2,
  "customerName": "Ahmed Ben Ali",
  "phone": "+216 71 234 567",
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Erreurs possibles:**
- `400`: Données invalides (ObjectId invalide, champs manquants)
- `404`: Produit ou vendeur non trouvé
- `500`: Erreur serveur

### 2. Récupérer les Précommandes (Filtrées)
```http
GET /api/preorders?vendorId=507f1f77bcf86cd799439012&status=pending
```

**Paramètres de requête:**
- `vendorId` (optionnel): Filtrer par vendeur
- `status` (optionnel): Filtrer par statut ('pending', 'confirmed', 'cancelled')

**Réponse Succès (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "productId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Plaquettes de frein",
      "brand": "Brembo"
    },
    "vendorId": "507f1f77bcf86cd799439012",
    "quantity": 2,
    "customerName": "Ahmed Ben Ali",
    "phone": "+216 71 234 567",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 3. Mettre à Jour le Statut
```http
PATCH /api/preorders/507f1f77bcf86cd799439013/status
Content-Type: application/json

{
  "status": "confirmed"
}
```

**Statuts valides:** `pending`, `confirmed`, `cancelled`

**Réponse Succès (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "status": "confirmed",
  // ... autres champs
}
```

### 4. Endpoint Debug (Test)
```http
POST /api/preorders/debug
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "vendorId": "507f1f77bcf86cd799439012",
  "quantity": 2,
  "customerName": "Test Client",
  "phone": "+216 71 234 567"
}
```

**Réponse:**
```json
{
  "validation": {
    "productIdValid": true,
    "vendorIdValid": true,
    "productExists": true,
    "vendorExists": true
  },
  "data": {
    "productId": "507f1f77bcf86cd799439011",
    "vendorId": "507f1f77bcf86cd799439012",
    "quantity": 2,
    "customerName": "Test Client",
    "phone": "+216 71 234 567"
  }
}
```

## 🎨 Interface Vendeur (Frontend React)

### Composant PreorderList

**Fichier:** `carpart/client/src/components/PreorderList.js`

**Fonctionnalités:**
- Affichage des précommandes filtrées par vendeur
- Filtrage par statut (pending, confirmed, cancelled)
- Actions pour confirmer/annuler les précommandes
- Interface responsive avec tableau

**Props:**
```javascript
{
  vendorId: String  // ID du vendeur connecté
}
```

**État local:**
```javascript
{
  preorders: Array,     // Liste des précommandes
  statusFilter: String,  // Filtre de statut actuel
  loading: Boolean      // État de chargement
}
```

## 📊 Toutes les APIs du Projet

### 🔐 Authentification (`/api/auth`)

```javascript
// POST /api/auth/signup
authAPI.signUp({
  username: "user123",
  email: "user@example.com",
  password: "password123",
  role: "vendor"
})

// POST /api/auth/signin
authAPI.signIn({
  email: "user@example.com",
  password: "password123"
})

// POST /api/auth/create-user (Superadmin seulement)
authAPI.createUser({
  username: "newuser",
  email: "newuser@example.com",
  password: "password123",
  role: "admin"
})
```

### 🛍️ Produits (`/api/products`)

```javascript
// GET /api/products - Tous les produits
productAPI.getAllProducts({
  category: "Engine",
  brand: "Toyota",
  minPrice: 100,
  maxPrice: 1000
})

// GET /api/products/:id - Produit par ID
productAPI.getProductById("507f1f77bcf86cd799439011")

// POST /api/products - Créer un produit
productAPI.createProduct(formData) // Multipart avec images

// PUT /api/products/:id - Mettre à jour un produit
productAPI.updateProduct("507f1f77bcf86cd799439011", formData)

// DELETE /api/products/:id - Supprimer un produit
productAPI.deleteProduct("507f1f77bcf86cd799439011")

// GET /api/products/seller/my-products - Produits du vendeur
productAPI.getSellerProducts()
```

### 📋 Précommandes (`/api/preorders`)

```javascript
// POST /api/preorders - Créer une précommande
fetch('/api/preorders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: "507f1f77bcf86cd799439011",
    vendorId: "507f1f77bcf86cd799439012",
    quantity: 2,
    customerName: "Ahmed Ben Ali",
    phone: "+216 71 234 567"
  })
})

// GET /api/preorders - Récupérer les précommandes
fetch('/api/preorders?vendorId=507f1f77bcf86cd799439012&status=pending')

// PATCH /api/preorders/:id/status - Mettre à jour le statut
fetch('/api/preorders/507f1f77bcf86cd799439013/status', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'confirmed' })
})

// POST /api/preorders/debug - Endpoint de test
fetch('/api/preorders/debug', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: "507f1f77bcf86cd799439011",
    vendorId: "507f1f77bcf86cd799439012",
    quantity: 2,
    customerName: "Test Client",
    phone: "+216 71 234 567"
  })
})
```

## 🧪 Tests des APIs

### Test avec cURL

**1. Créer une précommande:**
```bash
curl -X POST http://localhost:5000/api/preorders \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "507f1f77bcf86cd799439011",
    "vendorId": "507f1f77bcf86cd799439012",
    "quantity": 2,
    "customerName": "Ahmed Ben Ali",
    "phone": "+216 71 234 567"
  }'
```

**2. Récupérer les précommandes:**
```bash
curl "http://localhost:5000/api/preorders?vendorId=507f1f77bcf86cd799439012&status=pending"
```

**3. Mettre à jour le statut:**
```bash
curl -X PATCH http://localhost:5000/api/preorders/507f1f77bcf86cd799439013/status \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'
```

## 📝 Notes Techniques

### Validation des Données
- ObjectId MongoDB validation
- Champs requis (customerName, phone, quantity)
- Statuts valides (pending, confirmed, cancelled)

### Gestion d'Erreurs
- Erreurs de validation MongoDB
- Erreurs de référence (produit/vendeur inexistant)
- Erreurs de serveur (500)

### Sécurité
- Validation des ObjectIds
- Sanitisation des entrées
- Gestion des erreurs sans exposition de données sensibles

### Performance
- Index MongoDB sur vendorId et status
- Population des références (productId)
- Pagination possible pour de grandes listes

## 🚀 Fonctionnalités Futures

- [ ] Notifications en temps réel (WebSocket)
- [ ] Export PDF des précommandes
- [ ] Historique des changements de statut
- [ ] API de recherche avancée
- [ ] Intégration avec système de paiement
- [ ] Dashboard analytics pour vendeurs
