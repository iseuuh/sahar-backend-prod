const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// Créer une réservation (vérifie d'abord si créneau libre)
router.post('/', async (req, res) => {
  try {
    const { service, date, time, name, phone, email, notes } = req.body;

    // Validation téléphone tunisien (8 chiffres) – déjà géré par le schéma
    if (!/^\d{8}$/.test(phone)) {
      return res.status(400).json({ message: "Le numéro de téléphone doit contenir exactement 8 chiffres" });
    }

    // Vérifier si le créneau est déjà réservé (status != 'cancelled')
    const exists = await Reservation.findOne({ date, time, status: { $ne: "cancelled" } });
    if (exists) {
      return res.status(409).json({ message: "Ce créneau est déjà réservé" });
    }

    // Créer en statut "pending" (ou "confirmed" selon la politique)
    const reservation = new Reservation({ service, date, time, name, phone, email, notes, status: "confirmed" });
    await reservation.save();

    // Réponse
    return res.status(201).json({ success: true, reservation });
  } catch (err) {
    if (err.code === 11000) {
      // Erreur d'unicité (index)
      return res.status(409).json({ message: "Ce créneau est déjà réservé (doublon détecté)" });
    }
    console.error("Erreur création réservation :", err);
    return res.status(500).json({ message: "Erreur interne" });
  }
});

// GET toutes réservations (pour l'admin)
router.get('/', async (req, res) => {
  try {
    const list = await Reservation.find().sort({ date: 1, time: 1 });
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    console.error("Erreur fetch réservations :", err);
    res.status(500).json({ message: "Erreur interne" });
  }
});

// PATCH /api/reservations/:id pour modifier statut (confirm, cancel)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Status invalide" });
    }
    const updated = await Reservation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: "Réservation non trouvée" });
    return res.status(200).json({ success: true, reservation: updated });
  } catch (err) {
    console.error("Erreur update réservation :", err);
    return res.status(500).json({ message: "Erreur interne" });
  }
});

// DELETE /api/reservations/:id pour supprimer (optionnel)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Réservation non trouvée" });
    return res.status(200).json({ success: true, message: "Réservation supprimée" });
  } catch (err) {
    console.error("Erreur delete réservation :", err);
    return res.status(500).json({ message: "Erreur interne" });
  }
});

module.exports = router;
