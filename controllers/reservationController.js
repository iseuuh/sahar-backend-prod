const Reservation = require("../models/Reservation");
const sgMail = require('@sendgrid/mail');
const config = require('../config');

// Configuration de SendGrid avec la clé au bon format
sgMail.setApiKey(config.sendgridApiKey);

exports.createReservation = async (req, res) => {
  try {
    // Log de la requête entrante
    console.log('=== RESERVATION REQUEST ===');
    console.log('Headers:', req.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    // Vérifier si le body est un JSON valide
    if (!req.body || typeof req.body !== 'object') {
      console.error('Invalid request body:', req.body);
      return res.status(400).json({
        success: false,
        message: 'Données de réservation invalides'
      });
    }
    
    // Vérifier si tous les champs requis sont présents
    const requiredFields = ['service', 'date', 'time', 'name', 'phone'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Champs manquants: ${missingFields.join(', ')}`
      });
    }

    // Validation des données
    if (!/^[0-9]{10}$/.test(req.body.phone)) {
      return res.status(400).json({
        success: false,
        message: 'Numéro de téléphone invalide (10 chiffres requis)'
      });
    }

    const reservation = new Reservation(req.body);
    const savedReservation = await reservation.save();
    
    console.log('Reservation saved successfully:', savedReservation._id);
    
    // Envoi de l'email de confirmation
    try {
      const msg = {
        to: req.body.email || config.sendgridFromEmail,
        from: config.sendgridFromEmail,
        subject: 'Confirmation de réservation - Sahar Nail Care',
        text: `Bonjour ${req.body.name},\n\nVotre réservation pour ${req.body.service} le ${req.body.date} à ${req.body.time} a bien été enregistrée.\n\nNous vous contacterons pour confirmer votre rendez-vous.\n\nCordialement,\nSahar Nail Care`
      };
      await sgMail.send(msg);
      console.log('Confirmation email sent to:', req.body.email || config.sendgridFromEmail);
    } catch (emailErr) {
      console.error('Error sending confirmation email:', emailErr);
      // On continue même si l'email échoue
    }
    
    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès',
      data: savedReservation
    });
  } catch (err) {
    console.error('Error creating reservation:', err);
    
    // Gérer les erreurs de validation Mongoose
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la réservation',
      error: config.nodeEnv === 'development' ? err.message : undefined
    });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    console.log('Fetching all reservations...');
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    console.log(`Found ${reservations.length} reservations`);
    res.json({
      success: true,
      data: reservations
    });
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations',
      error: config.nodeEnv === 'development' ? err.message : undefined
    });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`Updating reservation ${id} to status: ${status}`);
    
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      console.error('Reservation not found:', id);
      return res.status(404).json({ 
        success: false,
        message: 'Réservation introuvable' 
      });
    }
    
    reservation.status = status;
    await reservation.save();
    
    // Envoi de l'email de mise à jour
    try {
      const msg = {
        to: reservation.email || config.sendgridFromEmail,
        from: config.sendgridFromEmail,
        subject: `Mise à jour de votre réservation - Sahar Nail Care`,
        text: `Bonjour ${reservation.name},\n\nVotre réservation pour ${reservation.service} le ${reservation.date} à ${reservation.time} a été mise à jour.\n\nNouveau statut: ${status}\n\nCordialement,\nSahar Nail Care`
      };
      await sgMail.send(msg);
      console.log('Update email sent to:', reservation.email || config.sendgridFromEmail);
    } catch (emailErr) {
      console.error('Error sending update email:', emailErr);
      // On continue même si l'email échoue
    }
    
    res.json({ 
      success: true,
      message: 'Réservation mise à jour',
      data: reservation 
    });
  } catch (err) {
    console.error('Error updating reservation:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la mise à jour de la réservation',
      error: config.nodeEnv === 'development' ? err.message : undefined 
    });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting reservation ${id}`);
    
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      console.error('Reservation not found:', id);
      return res.status(404).json({ 
        success: false,
        message: 'Réservation introuvable' 
      });
    }
    
    await Reservation.findByIdAndDelete(id);
    console.log('Reservation deleted successfully:', id);
    
    res.json({ 
      success: true,
      message: 'Réservation supprimée' 
    });
  } catch (err) {
    console.error('Error deleting reservation:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la suppression de la réservation',
      error: config.nodeEnv === 'development' ? err.message : undefined 
    });
  }
};
