import axios from 'axios';

// Fetch environment variables
const baseUrl = import.meta.env.PUBLIC_MEDUSA_BACKEND_URL;
const publishableApiKey = import.meta.env.PUBLIC_MEDUSA_PUBLISHABLE_KEY;

if (!baseUrl || !publishableApiKey) {
  console.error('Medusa backend URL or publishable API key is missing.');
}

// Create a Medusa client instance
const medusaClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'x-publishable-api-key': publishableApiKey,
    'Content-Type': 'application/json',
  },
});

export default medusaClient;