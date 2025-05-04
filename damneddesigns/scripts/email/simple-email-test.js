#!/usr/bin/env node
/**
 * Simple Email Test Script
 * For testing if email sending works with the current configuration
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

// Check for required environment variables
const requiredVars = [
  'SMTP_USERNAME',
  'SMTP_FROM',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REFRESH_TOKEN'
];

const missing = requiredVars.filter(v => !process.env[v]);
if (missing.length > 0) {
  console.error('❌ Missing environment variables:', missing.join(', '));
  process.exit(1);
}

async function testEmail() {
  console.log('🧪 Testing email configuration...');
  
  // Create transporter with proper OAuth2 configuration based on SMTP.md
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.SMTP_USERNAME,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      // Add optional parameters if they exist
      accessToken: process.env.GOOGLE_ACCESS_TOKEN || undefined,
      expires: process.env.GOOGLE_TOKEN_EXPIRES || undefined
    },
    debug: true
  });
  
  try {
    // Verify connection
    console.log('🔄 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    // Send test email
    console.log('📧 Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USERNAME,
      subject: 'Email System Test',
      html: `
        <h1>Damned Designs Email System Test</h1>
        <p>This is a test email sent at ${new Date().toLocaleString()}</p>
        <p>If you're receiving this, your email configuration is working correctly!</p>
        <ul>
          <li>From: ${process.env.SMTP_FROM}</li>
          <li>Username: ${process.env.SMTP_USERNAME}</li>
          <li>Test Date: ${new Date().toISOString()}</li>
        </ul>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('📨 Message ID:', info.messageId);
    
    return true;
  } catch (error) {
    console.error('❌ Email test failed:', error);
    if (error.code === 'EAUTH') {
      console.error('🔑 Authentication failed. Check your OAuth2 credentials.');
      console.error('Make sure you have set up the Google OAuth 2.0 correctly as described in SMTP.md');
      console.error('Your current environment variables:');
      console.error(`SMTP_USERNAME: ${process.env.SMTP_USERNAME ? '✓ Set' : '✗ Missing'}`);
      console.error(`SMTP_FROM: ${process.env.SMTP_FROM ? '✓ Set' : '✗ Missing'}`);
      console.error(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing'}`);
      console.error(`GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ Missing'}`);
      console.error(`GOOGLE_REFRESH_TOKEN: ${process.env.GOOGLE_REFRESH_TOKEN ? '✓ Set' : '✗ Missing'}`);
      console.error(`GOOGLE_ACCESS_TOKEN: ${process.env.GOOGLE_ACCESS_TOKEN ? '✓ Set' : '✗ Optional - Missing'}`);
      console.error(`GOOGLE_TOKEN_EXPIRES: ${process.env.GOOGLE_TOKEN_EXPIRES ? '✓ Set' : '✗ Optional - Missing'}`);
    }
    return false;
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testEmail()
    .then(success => {
      if (success) {
        console.log('✨ Email system is properly configured!');
        process.exit(0);
      } else {
        console.error('❌ Email system test failed. See errors above.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { testEmail };