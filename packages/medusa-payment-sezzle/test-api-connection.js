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
const SEZZLE_PUBLIC_KEY = process.env.SEZZLE_PUBLIC_KEY || 'sz_pub_mHYs860HGQAamnTUWOMfmOOsISn9slaT';
const SEZZLE_PRIVATE_KEY = process.env.SEZZLE_PRIVATE_KEY || 'sz_pr_SSKy28nqlOAd5ujZu9w8jEHCvGJ78fBR';
const SEZZLE_SANDBOX_MODE = process.env.SEZZLE_SANDBOX_MODE !== 'false'; // Default to sandbox if not specified

// Set API base URL based on sandbox mode
const API_BASE_URL = SEZZLE_SANDBOX_MODE 
  ? 'https://sandbox.gateway.sezzle.com/v2'
  : 'https://gateway.sezzle.com/v2';

async function testSezzleConnection() {
  console.log('Testing Sezzle Payment Gateway API Connection...');
  console.log(`API URL: ${API_BASE_URL}`);
  console.log(`Mode: ${SEZZLE_SANDBOX_MODE ? 'Sandbox' : 'Production'}`);
  console.log(`Using public key: ${SEZZLE_PUBLIC_KEY.substring(0, 8)}${'*'.repeat(SEZZLE_PUBLIC_KEY.length - 16)}${SEZZLE_PUBLIC_KEY.substring(SEZZLE_PUBLIC_KEY.length - 8)}`);
  
  // Basic Authorization header
  const authHeader = `Basic ${Buffer.from(`${SEZZLE_PUBLIC_KEY}:${SEZZLE_PRIVATE_KEY}`).toString('base64')}`;
  
  try {
    // 1. Try to fetch health status (not documented but common pattern)
    console.log('\nTesting API health endpoint...');
    try {
      await axios.get(`${API_BASE_URL}/health`, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });
      console.log('Health endpoint responded successfully');
    } catch (healthError) {
      console.log('Health endpoint not available, continuing with session creation test');
    }
    
    // 2. Create a minimal test session (which is documented)
    console.log('\nTesting session creation endpoint...');
    const response = await axios.post(
      `${API_BASE_URL}/session`,
      {
        amount: {
          amount_in_cents: 10000, // $100.00
          currency: 'USD'
        },
        order: {
          intent: 'AUTH',
          reference_id: `test-${Date.now()}`,
          description: 'API Connection Test',
        },
        urls: {
          cancel: 'https://example.com/cancel',
          complete: 'https://example.com/complete'
        }
      },
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('\n✅ Connection to Sezzle API successful!');
    console.log('\nSession creation response:');
    console.log(`UUID: ${response.data.uuid}`);
    console.log(`Order UUID: ${response.data.order.uuid}`);
    console.log(`Checkout URL: ${response.data.order.checkout_url}`);
    console.log(`Expiration: ${response.data.expiration}`);
    
    // Retrieve the order to further verify the API
    console.log('\nTesting order retrieval...');
    const orderResponse = await axios.get(
      `${API_BASE_URL}/order/${response.data.order.uuid}`,
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Order retrieval successful');
    console.log(`Order status: ${orderResponse.data.status}`);
    
    console.log('\n✅ Sezzle API connectivity tests passed!');
  } catch (error) {
    console.error('\n❌ Error connecting to Sezzle API:');
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
testSezzleConnection();
