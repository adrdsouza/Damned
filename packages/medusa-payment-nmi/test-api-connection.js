/**
 * NMI API Connection Test Script
 * Tests direct connectivity to the NMI payment gateway API
 */

const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file if present
try {
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('Loaded environment variables from .env file');
  }
} catch (error) {
  console.warn('Warning: Could not load .env file', error.message);
}

// Get security key from environment variables
const NMI_SECURITY_KEY = process.env.NMI_SECURITY_KEY || '6457Thfj624V5r7WUwc5v6a68Zsd6YEm'; // Test account security key
const NMI_API_URL = 'https://secure.nmi.com/api/transact.php';
const TEST_MODE = 'enabled';

async function testNMIConnection() {
  console.log('Testing NMI Payment Gateway API Connection...');
  console.log(`API URL: ${NMI_API_URL}`);
  console.log(`Using security key: ${NMI_SECURITY_KEY.substring(0, 5)}${'*'.repeat(NMI_SECURITY_KEY.length - 10)}${NMI_SECURITY_KEY.substring(NMI_SECURITY_KEY.length - 5)}`);
  
  try {
    // Test query - just performing a non-transactional query to validate API access
    // Using a validation call that doesn't actually process a payment
    const response = await axios.post(NMI_API_URL, new URLSearchParams({
      security_key: NMI_SECURITY_KEY,
      type: 'validate',
      ccnumber: '4111111111111111', // Test card number
      ccexp: '1025',               // Test expiration date (Oct 2025) - Required for test mode
      cvv: '999',                  // Test CVV for matching
      address1: '888',             // Test Address for AVS match
      zip: '77777',                // Test ZIP for AVS match
      test_mode: TEST_MODE         // Use test mode as specified in the documentation
    }));
    
    console.log('\nNMI API Response:');
    console.log(response.data);
    
    // Check for success response
    if (response.data.includes('response=1') || response.data.includes('result=1')) {
      console.log('\n✅ Connection to NMI API successful!');
      // Parse out specific values from the response
      const responseValues = response.data.split('&').reduce((obj, pair) => {
        const [key, value] = pair.split('=');
        obj[key] = value;
        return obj;
      }, {});
      
      console.log('\nResponse Details:');
      console.log(`Response: ${responseValues.response || responseValues.result}`);
      console.log(`Response Code: ${responseValues.response_code}`);
      console.log(`Response Text: ${responseValues.responsetext}`);
      console.log(`Transaction ID: ${responseValues.transactionid}`);
      console.log(`Authorization Code: ${responseValues.authcode}`);
    } else {
      console.log('\n❌ Connection to NMI API failed!');
      console.log('Response indicates failure. Check the response data above for more details.');
    }
  } catch (error) {
    console.error('\n❌ Error connecting to NMI API:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
      console.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`Error message: ${error.message}`);
    }
  }
}

// Execute the test
testNMIConnection();
