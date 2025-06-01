const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { createReservation, getAllReservations, updateReservation } = require('../controllers/reservationController');

router.post('/', async (req, res) => {
  try {
    const { service, date, time, name, phone, email, notes } = req.body;

    // Validation : numéro tunisien à 8 chiffres
    if (!/^\d{8}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Le numéro de téléphone doit contenir exactement 8 chiffres (format tunisien)"
      });
    }

    const newReservation = new Reservation({ service, date, time, name, phone, email, notes });
    const saved = await newReservation.save();

    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error('Erreur création réservation :', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.get('/', getAllReservations);
router.put('/:id', updateReservation);

// DELETE /api/reservations/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Introuvable' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
