const Reservation = require('../models/Reservation');
const Piece = require('../models/Piece');
const QRCodeService = require('../services/qrCodeService');

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