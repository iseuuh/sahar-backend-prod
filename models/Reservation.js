const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  service: {
    type: String,
    required: [true, 'Le service est requis'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'La date est requise'],
    trim: true
  },
  time: {
    type: String,
    required: [true, 'L\'heure est requise'],
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    trim: true,
    match: [/^\d{8}$/, "Le numéro de téléphone doit contenir exactement 8 chiffres (format tunisien)"]
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  cancellationToken: {
    type: String
  },
  notes: {
    type: String,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
