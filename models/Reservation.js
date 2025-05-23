const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  service: String,
  date: String,
  time: String,
  name: String,
  phone: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
