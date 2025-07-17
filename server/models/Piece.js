const mongoose = require('mongoose');

const pieceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  prix: { type: Number, required: true },
  vendeurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock: { type: Number, required: true },
  disponibilite: { type: Boolean, default: true },
  dateAjout: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Piece', pieceSchema); 