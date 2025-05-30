require('dotenv').config();

// Validate required environment variables
const requiredEnvs = ['MONGO_URI'];
requiredEnvs.forEach(key => {
  if (!process.env[key]) {
    console.error(`❌ Environment variable ${key} is required`);
    process.exit(1);
  }
});

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'https://sahar-frontend-9toxedkcp-hellomyworld123s-projects.vercel.app',
    'https://sahar-frontend.vercel.app',
    'https://nail-care-frontend.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.disable('x-powered-by');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Sahar Nail Care API',
    apiUrl: 'https://sahar-backend.onrender.com',
    status: 'online'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/auth', require('./routes/auth'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    message: 'Une erreur est survenue',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log('API URL: https://sahar-backend.onrender.com');
    console.log('Environment:', process.env.NODE_ENV || 'development');
  });
});

// Export the Express app
module.exports = app;
