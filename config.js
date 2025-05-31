require('dotenv').config();

// Log de débogage au démarrage
console.log('=== CONFIG INITIALIZATION ===');
console.log('Environment:', process.env.NODE_ENV);
console.log('JWT_SECRET from env:', process.env.JWT_SECRET ? '✓ Défini' : '✗ Non défini');
console.log('JWT_SECRET type:', process.env.JWT_SECRET ? typeof process.env.JWT_SECRET : 'undefined');
console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
console.log('===========================');

// S'assurer que JWT_SECRET est une chaîne de caractères valide
const jwtSecret = process.env.JWT_SECRET || 'ba269224303a9b1a7cb409085ec161a1';
if (typeof jwtSecret !== 'string' || jwtSecret.length === 0) {
  console.error('WARNING: Invalid JWT_SECRET format!');
  console.error('JWT_SECRET must be a non-empty string');
  process.exit(1);
}

const config = {
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sahar',
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  jwtSecret: jwtSecret
};

// Validation de la configuration
if (!config.jwtSecret) {
  console.error('WARNING: JWT_SECRET is not set in environment variables!');
  console.error('Using default secret. This is not recommended for production!');
}

// Log de la configuration finale
console.log('=== CONFIG FINAL STATE ===');
console.log('MongoDB URI:', config.mongoUri ? '✓ Défini' : '✗ Non défini');
console.log('Node Environment:', config.nodeEnv);
console.log('Port:', config.port);
console.log('JWT Secret:', config.jwtSecret ? '✓ Défini' : '✗ Non défini');
console.log('JWT Secret type:', typeof config.jwtSecret);
console.log('JWT Secret length:', config.jwtSecret.length);
console.log('========================');

module.exports = config; 