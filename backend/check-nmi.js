// Simple script to check NMI payment provider
const axios = require('axios');

async function checkPaymentProviders() {
  try {
    // Get all payment providers
    const response = await axios.get('http://localhost:9000/store/payment-providers', {
      params: {
        region_id: 'reg_01JRHVWY8KXADW4FW7QHXATGFD'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Payment providers:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error fetching payment providers:', error.response?.data || error.message);
  }
}

checkPaymentProviders();