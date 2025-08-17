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