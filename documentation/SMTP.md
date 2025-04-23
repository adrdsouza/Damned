# SMTP Configuration Guide for Medusa with Nodemailer

This guide provides instructions for completely replacing SendGrid with SMTP via the `medusa-plugin-nodemailer` package to address the vulnerability in axios that comes from `@medusajs/telemetry`.

## Installation

Install the required packages:

```bash
npm install nodemailer medusa-plugin-nodemailer
```

If you encounter npm installation issues related to "ENOTEMPTY", try:

```bash
npm install nodemailer medusa-plugin-nodemailer --force
```

## Configuration Steps

### 1. Remove SendGrid and Update medusa-config.js

Locate your `medusa-config.js` file in your Medusa project and modify the plugins section:

```javascript
// In your medusa-config.js
const plugins = [
  // REMOVE SendGrid completely - DO NOT just comment it out
  // The following plugin should be completely removed:
  // {
  //   resolve: `medusa-plugin-sendgrid`,
  //   options: {
  //     api_key: process.env.SENDGRID_API_KEY,
  //     from: process.env.SENDGRID_FROM,
  //     // other SendGrid options
  //   },
  // },
  
  // Also remove any official Medusa notification plugin if present
  // No official Medusa notification plugins are needed alongside nodemailer
  
  // Add the Nodemailer plugin with Google OAuth 2.0
  {
    resolve: `medusa-plugin-nodemailer`,
    options: {
      from: process.env.SMTP_FROM,
      transport: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        auth: {
          type: "OAuth2",
          user: process.env.SMTP_USERNAME, // your Google email
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          accessToken: process.env.GOOGLE_ACCESS_TOKEN, // Optional - generated from refresh token
          expires: process.env.GOOGLE_TOKEN_EXPIRES // Optional - expiration time in UNIX epoch time
        },
      },
    },
  },
  // ...other plugins
]
```

### 2. Set Environment Variables

Add these environment variables to your `.env` file:

```
SMTP_USERNAME=your-email@yourdomain.com
SMTP_FROM=your-email@yourdomain.com
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_REFRESH_TOKEN=your-google-oauth-refresh-token
GOOGLE_ACCESS_TOKEN=your-google-oauth-access-token (optional)
GOOGLE_TOKEN_EXPIRES=1682882673494 (optional - timestamp when token expires)
```

### 3. Setting Up Google OAuth 2.0

To set up Google OAuth 2.0 for your Medusa application:

1. **Create a Google Cloud Project**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Credentials"

2. **Configure OAuth Consent Screen**:
   - Click "OAuth consent screen" from the menu
   - Select User Type (Internal or External)
   - Fill in the required information about your app
   - Add the required scopes (at minimum `https://mail.google.com/`)
   - Save and continue

3. **Create OAuth 2.0 Client ID**:
   - Click "Credentials" from the menu
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application" as the Application type
   - Add a name for the client
   - Add authorized redirect URIs (you can use `http://localhost:9005/oauth2callback` for testing)
   - Click "Create"
   - Note your Client ID and Client Secret

4. **Generate Refresh Token**:
   - You can use this Node.js script to generate a refresh token:

```javascript
// oauth-token-generator.js
const { google } = require('googleapis');
const readline = require('readline');

const OAuth2 = google.auth.OAuth2;

// Replace these with your OAuth client credentials
const CLIENT_ID = 'your-client-id';
const CLIENT_SECRET = 'your-client-secret';
const REDIRECT_URL = 'http://localhost:9005/oauth2callback';

const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

// Generate a URL for authorization
const scopes = ['https://mail.google.com/'];
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent' // Forces to get a new refresh token
});

console.log('Visit this URL to authorize this application:', authUrl);

// Create readline interface for accepting the code
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the authorization code: ', (code) => {
  rl.close();
  
  // Exchange the code for tokens
  oauth2Client.getToken(code, (err, tokens) => {
    if (err) {
      console.error('Error getting tokens:', err);
      return;
    }
    console.log('Tokens:', tokens);
    console.log('\nAdd these to your .env file:');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    if (tokens.access_token) {
      console.log(`GOOGLE_ACCESS_TOKEN=${tokens.access_token}`);
    }
    if (tokens.expiry_date) {
      console.log(`GOOGLE_TOKEN_EXPIRES=${tokens.expiry_date}`);
    }
  });
});
```

5. **Install dependencies and run the script**:
   ```bash
   npm install googleapis
   node oauth-token-generator.js
   ```

6. **Follow the instructions**:
   - Open the provided URL in your browser
   - Authorize the application
   - Copy the code from the redirect URL
   - Paste it into the terminal
   - Add the generated tokens to your .env file

### 4. Testing the Configuration

After restarting your Medusa server, you can test the email functionality by:

1. Triggering a password reset
2. Creating an order (if order confirmation emails are enabled)
3. Or using the Medusa Admin to send a test email

## Benefits of This Approach

1. **Complete removal of SendGrid** - Eliminates the SendGrid dependency that includes a vulnerable axios version
2. **Enhanced security** - OAuth 2.0 is more secure than password-based authentication
3. **No app password required** - Works without needing to create app passwords
4. **Works with 2FA** - Compatible with accounts that have two-factor authentication enabled
5. **Revocable access** - You can revoke access from Google Cloud Console without changing your account password

## Additional Configuration Options

The `medusa-plugin-nodemailer` supports additional options such as:

```javascript
{
  resolve: `medusa-plugin-nodemailer`,
  options: {
    from: process.env.SMTP_FROM,
    // Template path for customizing email templates
    template_path: "path/to/custom/templates",
    // Order confirmation specific options
    order_placed_template: "custom-order-template.html",
    // Enable or disable specific email types
    enable_order_placed_emails: true,
    enable_customer_password_reset: true,
    // Advanced transport options
    transport: {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.SMTP_USERNAME,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
      // Uncomment for debugging SMTP issues
      // logger: true, 
      // debug: true
    },
  },
}
```

Remember to restart your Medusa server after making these changes for them to take effect.