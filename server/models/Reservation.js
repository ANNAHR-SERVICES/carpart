const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  acheteurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pieceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Piece',
    required: true
  },
  dateReservation: {
    type: Date,
    default: Date.now
  },
  qrcode: {
    type: String
  }
});

module.exports = mongoose.model('Reservation', ReservationSchema); 