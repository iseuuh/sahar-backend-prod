const express = require('express');
const router = express.Router();
const { createReservation, getAllReservations, updateReservation, deleteReservation } = require('../controllers/reservationController');
const { verifyToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

router.post('/', createReservation);
router.get('/', getAllReservations);
router.put('/:id', verifyToken, updateReservation);
router.delete('/:id', verifyToken, checkRole(['admin', 'manager']), deleteReservation);

module.exports = router;
