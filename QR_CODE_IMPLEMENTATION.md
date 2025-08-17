# 📱 Guide d'implémentation - Système QR Code pour Réservations

## 🎯 Vue d'ensemble

Ce guide détaille l'implémentation d'un système de QR Code pour les réservations de pièces automobiles dans l'application CarPart.

---

## 📋 Fonctionnalités du QR Code

### **Objectifs :**
- ✅ **Génération automatique** de QR codes pour chaque réservation
- ✅ **Stockage sécurisé** des données de réservation
- ✅ **Validation rapide** par scan du QR code
- ✅ **Interface mobile-friendly** pour consultation
- ✅ **Historique des réservations** avec QR codes

---

## 🛠️ Implémentation Backend

### **1. Installation des dépendances :**

```bash
cd server
npm install qrcode
npm install crypto-js
```

### **2. Création du service QR Code :**

#### **`server/services/qrCodeService.js`**
```javascript
const QRCode = require('qrcode');
const crypto = require('crypto-js');

class QRCodeService {
  // Générer un QR code pour une réservation
  static async generateReservationQR(reservationData) {
    try {
      // Données à encoder dans le QR code
      const qrData = {
        reservationId: reservationData._id,
        pieceId: reservationData.pieceId,
        acheteurId: reservationData.acheteurId,
        quantite: reservationData.quantite,
        timestamp: Date.now(),
        // URL pour consultation en ligne
        url: `${process.env.FRONTEND_URL}/reservation/${reservationData._id}`,
        // Hash de sécurité
        hash: crypto.SHA256(`${reservationData._id}${Date.now()}`).toString()
      };

      // Générer le QR code
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      return {
        qrCodeDataURL,
        qrData
      };
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
      throw new Error('Impossible de générer le QR code');
    }
  }

  // Valider un QR code scanné
  static validateQRCode(qrCodeData) {
    try {
      const data = JSON.parse(qrCodeData);
      
      // Vérifications de sécurité
      if (!data.reservationId || !data.hash) {
        return { valid: false, error: 'QR code invalide' };
      }

      // Vérifier le hash
      const expectedHash = crypto.SHA256(`${data.reservationId}${data.timestamp}`).toString();
      if (data.hash !== expectedHash) {
        return { valid: false, error: 'QR code corrompu' };
      }

      // Vérifier l'expiration (24h)
      const now = Date.now();
      const qrAge = now - data.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 heures

      if (qrAge > maxAge) {
        return { valid: false, error: 'QR code expiré' };
      }

      return { valid: true, data };
    } catch (error) {
      return { valid: false, error: 'Format QR code invalide' };
    }
  }
}

module.exports = QRCodeService;
```

### **3. Modification du contrôleur de réservation :**

#### **`server/controllers/acheteurController.js`**
```javascript
const Reservation = require('../models/Reservation');
const Piece = require('../models/Piece');
const QRCodeService = require('../services/qrCodeService');

// ... code existant ...

const reserverPiece = async (req, res) => {
  try {
    const acheteurId = req.user.userId;
    const { pieceId, quantite, dateReservation, commentaire } = req.body;

    // Vérifier que la pièce existe
    const piece = await Piece.findById(pieceId);
    if (!piece) {
      return res.status(404).json({
        message: "Pièce non trouvée",
        error: "PIECE_NOT_FOUND"
      });
    }

    // Vérifier le stock
    if (piece.stock < quantite) {
      return res.status(409).json({
        message: "Stock insuffisant",
        error: "INSUFFICIENT_STOCK",
        availableStock: piece.stock
      });
    }

    // Créer la réservation
    const reservation = new Reservation({
      acheteurId,
      pieceId,
      quantite,
      dateReservation: dateReservation || new Date(),
      commentaire,
      statut: 'en_attente'
    });

    await reservation.save();

    // Mettre à jour le stock
    piece.stock -= quantite;
    await piece.save();

    // Générer le QR code
    const { qrCodeDataURL, qrData } = await QRCodeService.generateReservationQR(reservation);

    // Sauvegarder les données QR dans la réservation
    reservation.qrCodeData = qrData;
    reservation.qrCodeImage = qrCodeDataURL;
    await reservation.save();

    res.status(201).json({
      message: "Réservation créée avec succès",
      reservation: {
        _id: reservation._id,
        acheteurId: reservation.acheteurId,
        pieceId: reservation.pieceId,
        quantite: reservation.quantite,
        statut: reservation.statut,
        dateReservation: reservation.dateReservation,
        dateCreation: reservation.dateCreation,
        qrCodeDataURL,
        qrData
      }
    });

  } catch (error) {
    console.error('Erreur lors de la réservation:', error);
    res.status(500).json({
      message: "Erreur lors de la réservation",
      error: "RESERVATION_ERROR"
    });
  }
};

// Nouvelle fonction pour valider un QR code
const validateQRCode = async (req, res) => {
  try {
    const { qrCodeData } = req.body;
    
    const validation = QRCodeService.validateQRCode(qrCodeData);
    
    if (!validation.valid) {
      return res.status(400).json({
        message: validation.error,
        error: "INVALID_QR_CODE"
      });
    }

    // Récupérer les détails de la réservation
    const reservation = await Reservation.findById(validation.data.reservationId)
      .populate('pieceId')
      .populate('acheteurId', 'name email');

    if (!reservation) {
      return res.status(404).json({
        message: "Réservation non trouvée",
        error: "RESERVATION_NOT_FOUND"
      });
    }

    res.json({
      message: "QR code valide",
      reservation: {
        _id: reservation._id,
        piece: reservation.pieceId,
        acheteur: reservation.acheteurId,
        quantite: reservation.quantite,
        statut: reservation.statut,
        dateReservation: reservation.dateReservation,
        dateCreation: reservation.dateCreation
      }
    });

  } catch (error) {
    console.error('Erreur lors de la validation du QR code:', error);
    res.status(500).json({
      message: "Erreur lors de la validation",
      error: "VALIDATION_ERROR"
    });
  }
};

module.exports = {
  reserverPiece,
  validateQRCode
};
```

### **4. Ajout des routes QR Code :**

#### **`server/routes/acheteur.js`**
```javascript
const express = require('express');
const router = express.Router();
const { reserverPiece, validateQRCode } = require('../controllers/acheteurController');
const { authenticateJWT } = require('../middleware/auth');

// Route existante
router.post('/reserverPiece', authenticateJWT, reserverPiece);

// Nouvelle route pour validation QR code
router.post('/validateQRCode', authenticateJWT, validateQRCode);

module.exports = router;
```

---

## 🎨 Implémentation Frontend

### **1. Installation des dépendances :**

```bash
cd client
npm install qrcode.react
npm install html2canvas
```

### **2. Composant QR Code :**

#### **`client/src/components/QRCodeDisplay.js`**
```javascript
import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import './QRCodeDisplay.css';

const QRCodeDisplay = ({ reservationData, qrCodeDataURL }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadQRCode = async () => {
    setIsDownloading(true);
    try {
      const qrElement = document.getElementById('qr-code-container');
      const canvas = await html2canvas(qrElement, {
        backgroundColor: '#ffffff',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `reservation-${reservationData._id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const shareQRCode = async () => {
    try {
      const qrElement = document.getElementById('qr-code-container');
      const canvas = await html2canvas(qrElement, {
        backgroundColor: '#ffffff',
        scale: 2
      });
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve));
      
      if (navigator.share) {
        await navigator.share({
          title: 'Ma réservation CarPart',
          text: `Réservation #${reservationData._id}`,
          files: [new File([blob], 'reservation.png', { type: 'image/png' })]
        });
      } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API Share
        const link = document.createElement('a');
        link.download = `reservation-${reservationData._id}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  return (
    <div className="qr-code-display">
      <h3>QR Code de votre réservation</h3>
      
      <div id="qr-code-container" className="qr-code-container">
        <div className="qr-code-header">
          <h4>CarPart</h4>
          <p>Réservation #{reservationData._id}</p>
        </div>
        
        <div className="qr-code-image">
          <QRCode
            value={JSON.stringify(reservationData.qrData)}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        
        <div className="qr-code-info">
          <p><strong>Pièce:</strong> {reservationData.piece?.nom}</p>
          <p><strong>Quantité:</strong> {reservationData.quantite}</p>
          <p><strong>Statut:</strong> {reservationData.statut}</p>
          <p><strong>Date:</strong> {new Date(reservationData.dateCreation).toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
      
      <div className="qr-code-actions">
        <button 
          onClick={downloadQRCode}
          disabled={isDownloading}
          className="download-btn"
        >
          {isDownloading ? 'Téléchargement...' : 'Télécharger QR Code'}
        </button>
        
        <button 
          onClick={shareQRCode}
          className="share-btn"
        >
          Partager
        </button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
```

### **3. Styles CSS pour le QR Code :**

#### **`client/src/components/QRCodeDisplay.css`**
```css
.qr-code-display {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.qr-code-container {
  text-align: center;
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  background: white;
}

.qr-code-header {
  margin-bottom: 20px;
}

.qr-code-header h4 {
  color: #667eea;
  font-size: 24px;
  margin: 0 0 5px 0;
}

.qr-code-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.qr-code-image {
  margin: 20px 0;
  padding: 15px;
  background: white;
  border-radius: 8px;
  display: inline-block;
}

.qr-code-info {
  margin-top: 20px;
  text-align: left;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.qr-code-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #333;
}

.qr-code-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.download-btn,
.share-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.download-btn {
  background: #667eea;
  color: white;
}

.download-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.share-btn {
  background: #28a745;
  color: white;
}

.share-btn:hover {
  background: #218838;
}

.download-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .qr-code-display {
    padding: 15px;
  }
  
  .qr-code-actions {
    flex-direction: column;
  }
  
  .download-btn,
  .share-btn {
    width: 100%;
  }
}
```

### **4. Scanner QR Code :**

#### **`client/src/components/QRCodeScanner.js`**
```javascript
import React, { useState, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import { acheteurAPI } from '../services/api';
import toast from 'react-hot-toast';
import './QRCodeScanner.css';

const QRCodeScanner = ({ onQRCodeScanned }) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async (data) => {
    if (data && !scanning) {
      setScanning(true);
      try {
        const response = await acheteurAPI.validateQRCode({ qrCodeData: data });
        setResult(response.data);
        onQRCodeScanned(response.data);
        toast.success('QR Code validé avec succès !');
      } catch (error) {
        console.error('Erreur lors de la validation:', error);
        toast.error('QR Code invalide ou expiré');
      } finally {
        setScanning(false);
      }
    }
  };

  const handleError = (error) => {
    console.error('Erreur du scanner:', error);
    toast.error('Erreur du scanner de QR Code');
  };

  return (
    <div className="qr-scanner">
      <h3>Scanner QR Code</h3>
      
      <div className="scanner-container">
        <QrReader
          onResult={handleScan}
          constraints={{ facingMode: 'environment' }}
          className="qr-reader"
        />
      </div>
      
      {scanning && (
        <div className="scanning-overlay">
          <div className="spinner"></div>
          <p>Validation en cours...</p>
        </div>
      )}
      
      {result && (
        <div className="scan-result">
          <h4>Réservation trouvée</h4>
          <p><strong>ID:</strong> {result.reservation._id}</p>
          <p><strong>Pièce:</strong> {result.reservation.piece.nom}</p>
          <p><strong>Quantité:</strong> {result.reservation.quantite}</p>
          <p><strong>Statut:</strong> {result.reservation.statut}</p>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
```

---

## 🧪 Tests et Validation

### **1. Test de génération QR Code :**

```javascript
// Test avec Thunder Client
POST http://localhost:5000/api/acheteur/reserverPiece
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "pieceId": "6894fd7a2c790808cb74334d",
  "quantite": 1,
  "commentaire": "Test QR Code"
}
```

### **2. Test de validation QR Code :**

```javascript
POST http://localhost:5000/api/acheteur/validateQRCode
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "qrCodeData": "{\"reservationId\":\"...\",\"hash\":\"...\"}"
}
```

---

## 📱 Utilisation mobile

### **1. Consultation des réservations :**
- Scan du QR code avec l'appareil photo
- Redirection vers la page de réservation
- Affichage des détails en temps réel

### **2. Partage de réservations :**
- Génération de QR code personnalisé
- Partage via WhatsApp, Email, etc.
- Validation par le vendeur

---

## 🔒 Sécurité

### **Mesures de sécurité :**
- ✅ **Hash cryptographique** pour validation
- ✅ **Expiration automatique** (24h)
- ✅ **Validation côté serveur**
- ✅ **Données chiffrées** dans le QR code

---

*Guide d'implémentation QR Code - Version 1.0* 