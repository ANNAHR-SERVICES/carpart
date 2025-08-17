const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Engine', 'Transmission', 'Brakes', 'Suspension', 'Electrical', 'Body', 'Interior', 'Other']
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Used', 'Refurbished']
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  images: [{
    type: String,
    required: true
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances de recherche
productSchema.index({ name: 'text', description: 'text', brand: 'text', model: 'text' });
productSchema.index({ category: 1, brand: 1, year: 1 });
productSchema.index({ seller: 1 });

module.exports = mongoose.model('Product', productSchema); 