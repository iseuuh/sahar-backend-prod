const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('Testing login...');
    console.log('Request payload:', {
      email: 'admin@sahar.com',
      password: 'sahar2024'
    });

    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@sahar.com',
      password: 'sahar2024'
    });

    console.log('Login successful!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);

    // Test the /me endpoint with the token
    console.log('\nTesting /me endpoint...');
    const meResponse = await axios.get('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${response.data.token}`
      }
    });

    console.log('User info retrieved successfully!');
    console.log('User data:', meResponse.data);

  } catch (error) {
    console.error('Test failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error response:', error.response.data);
      console.error('Error details:', error.response.data.message);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
      console.error('Error request:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testLogin(); 