/**
 * OAuth2 Token Generator for Gmail SMTP
 * 
 * This script helps generate OAuth2 tokens for Gmail SMTP authentication.
 */

const { google } = require('googleapis');
const readline = require('readline');
require('dotenv').config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function generateTokens() {
  console.log('🔐 Gmail OAuth2 Token Generator');
  console.log('===============================');
  
  // Set up OAuth2 client with the correct redirect URI
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );
  
  // Generate authorization URL
  const scopes = ['https://mail.google.com/'];
  if (!clientSecret) {
    clientSecret = await new Promise(resolve => {
      rl.question('Enter your Google OAuth Client Secret: ', answer => resolve(answer.trim()));
    });
  } else {
    console.log(`Using Client Secret from environment: ${clientSecret.substring(0, 4)}...`);
  }
  
  return { clientId, clientSecret };
}

// Main function to generate tokens
async function generateTokens() {
  console.log('🔐 Gmail OAuth2 Token Generator');
  console.log('===============================');
  console.log('This script will help you generate new OAuth2 tokens for Gmail SMTP authentication.');
  console.log('You will need to authorize the application in your browser.\n');
  
  // Get credentials
  const { clientId, clientSecret } = await getCredentials();
  
  // Set up OAuth2 client
  const redirectUrl = 'https://developers.google.com/oauthplayground';
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
  
  // Generate authorization URL
  const scopes = ['https://mail.google.com/'];
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent' // Forces to get a new refresh token
  });
  
  // Display URL to user
  console.log('\n🌐 Visit this URL to authorize the application:');
  console.log('\x1b[36m%s\x1b[0m', authUrl); // Cyan color
  console.log('\nAfter authorization, you will be redirected to a URL that contains a code.');
  
  // Get authorization code from user
  const code = await new Promise(resolve => {
    rl.question('Paste the authorization code here: ', answer => resolve(answer.trim()));
  });
  
  try {
    // Exchange code for tokens
    console.log('\n🔄 Exchanging authorization code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('\n✅ Successfully generated tokens!');
    console.log('\n📋 Copy these values to your .env file:');
    console.log('\x1b[32m%s\x1b[0m', `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`); // Green color
    
    if (tokens.access_token) {
      console.log('\x1b[32m%s\x1b[0m', `GOOGLE_ACCESS_TOKEN=${tokens.access_token}`);
    }
    
    if (tokens.expiry_date) {
      console.log('\x1b[32m%s\x1b[0m', `GOOGLE_TOKEN_EXPIRES=${tokens.expiry_date}`);
    }
    
    console.log('\n⚠️  Keep these tokens secure! The refresh token is particularly sensitive.');
    console.log('   After updating your .env file, restart your Medusa server.');
    
    return tokens;
  } catch (error) {
    console.error('\n❌ Error exchanging code for tokens:', error.message);
    if (error.response && error.response.data) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  } finally {
    rl.close();
  }
}

// Run the generator if the script is executed directly
if (require.main === module) {
  generateTokens()
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = { generateTokens };