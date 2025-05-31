const express = require('express');
const router = express.Router();
const { register, verify, forgotPassword, resetPassword } = require('../controllers/userController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const config = require('../config');

// Log de débogage au démarrage
console.log('=== AUTH ROUTES INITIALIZATION ===');
console.log('JWT Secret from config:', config.jwtSecret ? '✓ Défini' : '✗ Non défini');
console.log('JWT Secret length:', config.jwtSecret ? config.jwtSecret.length : 0);
console.log('================================');

router.post('/register', register);
router.get('/verify', verify);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt for email:', req.body.email);
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    console.log('User found:', { id: user._id, email: user.email, role: user.role });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    console.log('Password verified for user:', email);

    // Vérification détaillée du JWT_SECRET
    console.log('=== JWT SECRET DEBUG ===');
    console.log('JWT Secret from env:', process.env.JWT_SECRET ? '✓ Défini' : '✗ Non défini');
    console.log('JWT Secret type:', typeof process.env.JWT_SECRET);
    console.log('JWT Secret length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
    console.log('========================');

    if (!process.env.JWT_SECRET || typeof process.env.JWT_SECRET !== 'string' || process.env.JWT_SECRET.length === 0) {
      throw new Error(`Invalid JWT_SECRET: ${JSON.stringify({
        exists: !!process.env.JWT_SECRET,
        type: typeof process.env.JWT_SECRET,
        length: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0
      })}`);
    }

    // Generate token with explicit string conversion
    const token = jwt.sign(
      { id: user._id.toString() },
      String(process.env.JWT_SECRET),
      { 
        algorithm: 'HS256',
        expiresIn: '24h'
      }
    );
    console.log('Token generated successfully');

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      jwtSecret: process.env.JWT_SECRET ? 'defined' : 'undefined',
      jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
      jwtSecretType: process.env.JWT_SECRET ? typeof process.env.JWT_SECRET : 'undefined',
      jwtSecretValue: process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 4) + '...' : 'undefined'
    });
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la connexion'
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue'
    });
  }
});

module.exports = router; 