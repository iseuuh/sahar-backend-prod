// Configuration centralisée
const config = {
  jwtSecret: process.env.JWT_SECRET || 'ba269224303a9b1a7cb409085ec161a1',
  mongoUri: process.env.MONGO_URI,
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000
};

// Vérification des variables critiques
console.log('=== CONFIGURATION ===');
console.log('JWT_SECRET:', config.jwtSecret ? '✓ Défini' : '✗ Non défini');
console.log('MONGO_URI:', config.mongoUri ? '✓ Défini' : '✗ Non défini');
console.log('NODE_ENV:', config.nodeEnv);
console.log('PORT:', config.port);
console.log('====================');

module.exports = config; 