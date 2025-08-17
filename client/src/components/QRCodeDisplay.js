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