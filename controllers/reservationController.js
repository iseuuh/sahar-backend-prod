const Reservation = require("../models/Reservation");

exports.createReservation = async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.json({ success: true, reservation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
