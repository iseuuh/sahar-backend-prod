const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { createReservation, getAllReservations, updateReservation } = require('../controllers/reservationController');
const { verifyToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

router.post('/', createReservation);
router.get('/', getAllReservations);
router.put('/:id', verifyToken, updateReservation);

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
