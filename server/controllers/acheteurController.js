const Piece = require('../models/Piece');
const Reservation = require('../models/Reservation');

exports.reserverPiece = async (req, res) => {
  const { pieceId } = req.body;
  const acheteurId = req.user._id;
  const piece = await Piece.findById(pieceId);
  if (!piece) return res.status(404).json({ message: 'Pièce non trouvée' });
  if (!piece.disponibilite || piece.stock <= 0) return res.status(400).json({ message: 'Pièce non disponible' });
  const reservation = await Reservation.create({ acheteurId, pieceId });
  piece.stock -= 1;
  if (piece.stock === 0) piece.disponibilite = false;
  await piece.save();
  res.json({ message: 'Réservation réussie', reservation });
}; 