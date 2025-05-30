const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('Attempting to connect to server...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@sahar.com',
      password: 'sahar2024'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Login failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error response:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
      console.error('Error request:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testLogin(); 