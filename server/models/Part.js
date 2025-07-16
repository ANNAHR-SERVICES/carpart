const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        text: true
    },
    description: {
        type: String,
        trim: true,
        text: true
    },
    vin: {
        type: String,
        uppercase: true,
        trim: true,
        unique: true,
        sparse: true
    },
    make: {
        type: String,
        trim: true,
        text: true
    },
    model: {
        type: String,
        trim: true,
        text: true
    },
    year: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear() + 1
    },
    partNumber: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        text: true
    },
    category: {
        type: String,
        trim: true,
        text: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    stockQuantity: {
        type: Number,
        min: 0,
        default: 0
    },
}, {
    timestamps: true
});

partSchema.index({
    name: 'text',
    description: 'text',
    make: 'text',
    model: 'text',
    partNumber: 'text',
    category: 'text'
});

const Part = mongoose.model('Part', partSchema);

module.exports = Part;