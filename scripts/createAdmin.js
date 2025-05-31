require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin exists
    const admin = await User.findOne({ email: 'admin@sahar.com' });
    if (admin) {
      console.log('\nAdmin user already exists:');
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
      console.log('Created at:', admin.createdAt);
      console.log('Updated at:', admin.updatedAt);
      console.log('ID:', admin._id);
      return;
    }

    // Create admin user
    const adminUser = new User({
      email: 'admin@sahar.com',
      password: 'sahar2024',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createAdmin(); 