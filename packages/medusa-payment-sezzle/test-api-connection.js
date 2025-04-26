/**
 * Sezzle API Connection Test Script
 * Tests direct connectivity to the Sezzle payment gateway API
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

// Get Sezzle API credentials from environment variables or use documented values
const SEZZLE_PUBLIC_KEY = process.env.SEZZLE_PUBLIC_KEY || 'sz_pub_fV7SRB5FuCvueYl07GA5lOObLRjEY6be';
const SEZZLE_PRIVATE_KEY = process.env.SEZZLE_PRIVATE_KEY || 'sz_pr_nIhPldbj7QgcZjWffh78GV6kYKgyqBog';
const SEZZLE_SANDBOX_MODE = process.env.SEZZLE_SANDBOX_MODE === 'true';

// Set API base URL based on sandbox mode - removing /v2 as it might be incorrect
const API_BASE_URL = SEZZLE_SANDBOX_MODE 
  ? 'https://sandbox.gateway.sezzle.com'
  : 'https://gateway.sezzle.com';

async function testSezzleConnection() {
  console.log('Testing Sezzle Payment Gateway API Connection...');
  console.log(`API URL: ${API_BASE_URL}`);
  console.log(`Mode: ${SEZZLE_SANDBOX_MODE ? 'Sandbox' : 'Production'}`);
  console.log(`Using public key: ${SEZZLE_PUBLIC_KEY.substring(0, 8)}${'*'.repeat(SEZZLE_PUBLIC_KEY.length - 16)}${SEZZLE_PUBLIC_KEY.substring(SEZZLE_PUBLIC_KEY.length - 8)}`);
  
  // Sezzle requires a two-step authentication process:
  // 1. Obtain a token using public/private keys
  // 2. Use the token in a Bearer authentication header
  console.log(`Using Sezzle documented authentication process...`);
  
  try {
    // Step 1: Get an authentication token
    console.log('\nStep 1: Obtaining authentication token...');
    const authPayload = {
      public_key: SEZZLE_PUBLIC_KEY,
      private_key: SEZZLE_PRIVATE_KEY
    };
    
    console.log('Authentication payload:', JSON.stringify(authPayload, null, 2));
    
    let authToken;
    try {
      const authResponse = await axios.post(
        `${API_BASE_URL}/v2/authentication`,
        authPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      authToken = authResponse.data.token;
      console.log(`Authentication successful! Token received: ${authToken.substring(0, 5)}...`);
      console.log(`Token expires: ${authResponse.data.expiration_date}`);
      console.log(`Merchant UUID: ${authResponse.data.merchant_uuid}`);
    } catch (authError) {
      console.error('Authentication failed:', authError.response?.status, authError.response?.data);
      throw new Error('Failed to obtain authentication token');
    }
    
    // Step 2: Create a session using the token
    console.log('\nStep 2: Creating checkout session with token...');
    
    // Using the correct format from documentation
    const sessionPayload = {
      origin: "https://damneddesigns.com",
      mode: "iframe",
      merchant_reference_id: `test-${Date.now()}`,
      amount_in_cents: 10000, // $100.00 (in cents)
      currency: "USD",
      customer: {
        email: "test@example.com",
        first_name: "Test",
        last_name: "User",
        phone: "6125551234",
        billing_address: {
          street: "123 W Lake St",
          street2: "Unit 104",
          city: "Minneapolis",
          state: "MN",
          postal_code: "55408",
          country_code: "US"
        }
      },
      items: [
        {
          name: "Test Item",
          sku: "sku123456",
          quantity: 1,
          price: {
            amount_in_cents: 10000,
            currency: "USD"
          }
        }
      ]
    };
    
    console.log('Session payload:', JSON.stringify(sessionPayload, null, 2));
    
    const sessionHeaders = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    console.log('Using headers:', JSON.stringify(sessionHeaders, null, 2));
    
    try {
      // Use the correct endpoint for virtual card session
      const sessionResponse = await axios.post(
        `${API_BASE_URL}/v2/session/card`,
        sessionPayload,
        { headers: sessionHeaders }
      );
      
      console.log('\n✅ Connection to Sezzle API successful!');
      console.log('\nCard Session creation response:');
      console.log(`UUID: ${sessionResponse.data.uuid}`);
      console.log(`Dashboard URL: ${sessionResponse.data.dashboard_url}`);
    } catch (sessionError) {
      console.error('Session creation failed:', sessionError.response?.status, sessionError.response?.data);
      throw new Error('Failed to create checkout session');
    }
  } catch (error) {
    console.error('\n❌ Error connecting to Sezzle API:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error('No response received from server');
      console.error(error.request);
    } else {
      console.error(`Error message: ${error.message}`);
    }
    process.exit(1);
  }
}

// Execute the test
testSezzleConnection();
