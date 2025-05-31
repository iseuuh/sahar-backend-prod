require('dotenv').config();

// Log de débogage au démarrage
console.log('=== CONFIG INITIALIZATION ===');
console.log('Environment:', process.env.NODE_ENV);
console.log('JWT_SECRET from env:', process.env.JWT_SECRET ? '✓ Défini' : '✗ Non défini');
console.log('MONGO_URI from env:', process.env.MONGO_URI ? '✓ Défini' : '✗ Non défini');
console.log('SENDGRID_API_KEY from env:', process.env.SENDGRID_API_KEY ? '✓ Défini' : '✗ Non défini');
console.log('SENDGRID_FROM_EMAIL from env:', process.env.SENDGRID_FROM_EMAIL ? '✓ Défini' : '✗ Non défini');
console.log('===========================');

// Configuration avec valeurs par défaut sécurisées
const config = {
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://iseuuh:Haha1122@saharnailcare.bbqh4mo.mongodb.net/?retryWrites=true&w=majority&appName=SaharNailCare',
  nodeEnv: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'ba269224303a9b1a7cb409085ec161a1',
  // Format correct pour SendGrid
  sendgridApiKey: process.env.SENDGRID_API_KEY ? `SG.${process.env.SENDGRID_API_KEY}` : 'SG.db369ae12906d6fcc0a08024fd0cfea3',
  sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || 'contact@saharnailcare.com'
};

// Validation de la configuration
if (!config.jwtSecret || !config.mongoUri) {
  console.error('WARNING: JWT_SECRET or MONGO_URI is not set in environment variables!');
  console.error('Using default values. This is not recommended for production!');
}

// Log de la configuration finale
console.log('=== CONFIG FINAL STATE ===');
console.log('MongoDB URI:', config.mongoUri ? '✓ Défini' : '✗ Non défini');
console.log('Node Environment:', config.nodeEnv);
console.log('Port:', config.port);
console.log('JWT Secret:', config.jwtSecret ? '✓ Défini' : '✗ Non défini');
console.log('SendGrid API Key:', config.sendgridApiKey ? '✓ Défini' : '✗ Non défini');
console.log('SendGrid From Email:', config.sendgridFromEmail ? '✓ Défini' : '✗ Non défini');
console.log('========================');

module.exports = config; 