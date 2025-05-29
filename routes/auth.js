const express = require('express');
const router = express.Router();
const { register, verify, forgotPassword, resetPassword, login } = require('../controllers/userController');

router.post('/register', register);
router.get('/verify', verify);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/login', login);

module.exports = router; 