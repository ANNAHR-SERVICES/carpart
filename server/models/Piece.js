const mongoose = require('mongoose');

const pieceSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: [true, 'Nom du produit requis'],
    trim: true
  },
  description: { 
    type: String,
    trim: true
  },
  prix: { 
    type: Number, 
    required: [true, 'Prix requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  stock: { 
    type: Number, 
    required: [true, 'Stock requis'],
    min: [0, 'Le stock ne peut pas être négatif'],
    default: 0
  },
  vendeurId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Vendeur requis']
  },
  disponibilite: { 
    type: Boolean, 
    default: true 
  },
  // Nouveaux champs pour la catégorisation
  categorie: { 
    type: String,
    trim: true,
    enum: ['moteur', 'freinage', 'suspension', 'electricite', 'carrosserie', 'interieur', 'autre']
  },
  marque: { 
    type: String,
    trim: true
  },
  modele: { 
    type: String,
    trim: true
  },
  annee: { 
    type: Number,
    min: [1900, 'Année invalide'],
    max: [2030, 'Année invalide']
  },
  // Images (URLs)
  images: [{
    type: String,
    trim: true
  }],
  // Spécifications techniques
  specifications: {
    type: Map,
    of: String
  },
  // Métadonnées
  dateAjout: { 
    type: Date, 
    default: Date.now 
  },
  dateModification: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware pour mettre à jour dateModification
pieceSchema.pre('save', function(next) {
  this.dateModification = new Date();
  next();
});

// Index pour améliorer les performances de recherche
pieceSchema.index({ nom: 'text', description: 'text', marque: 'text', modele: 'text' });
pieceSchema.index({ vendeurId: 1 });
pieceSchema.index({ categorie: 1 });
pieceSchema.index({ disponibilite: 1 });

module.exports = mongoose.model('Piece', pieceSchema); 