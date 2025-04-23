import { PUBLIC_MEDUSA_BACKEND_URL } from '$env/static/public';
import Medusa from '@medusajs/medusa-js';

// Create and initialize Medusa client
export const createMedusaClient = async () => {
  try {
    // Get the publishable API key
    const response = await fetch("/api/pubkey");
    const { publishableKey } = await response.json();
    
    // Create Medusa client, passing the publishable key directly
    const medusaClient = new Medusa({
      baseUrl: PUBLIC_MEDUSA_BACKEND_URL,
      maxRetries: 3,
      publishableApiKey: publishableKey // Pass the key here
    });
    
    return medusaClient;
  } catch (error) {
    console.error('Failed to initialize Medusa client:', error);
    throw error;
  }
};