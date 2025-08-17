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