const express = require('express');
const router = express.Router();
const { register, verify, forgotPassword, resetPassword } = require('../controllers/userController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const config = require('../config');

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

    // Generate token
    console.log('Generating token with secret length:', config.jwtSecret.length);
    const token = jwt.sign(
      { id: user._id.toString() },
      config.jwtSecret,
      { algorithm: 'HS256' }
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
      jwtSecret: config.jwtSecret ? 'defined' : 'undefined',
      jwtSecretLength: config.jwtSecret ? config.jwtSecret.length : 0
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