const Reservation = require("../models/Reservation");

exports.createReservation = async (req, res) => {
  try {
    console.log('Received reservation request:', req.body);
    
    // Vérifier si tous les champs requis sont présents
    const requiredFields = ['service', 'date', 'time', 'name', 'phone', 'email'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Champs manquants: ${missingFields.join(', ')}`
      });
    }

    const reservation = new Reservation(req.body);
    const savedReservation = await reservation.save();
    
    console.log('Reservation saved successfully:', savedReservation);
    
    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès',
      reservation: savedReservation
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
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: reservations
    });
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
