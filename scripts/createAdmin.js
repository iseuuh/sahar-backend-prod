require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@sahar.com';
    const adminPassword = 'Admin123!';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new User({
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);

  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin(); 