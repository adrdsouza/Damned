const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a dedicated function to test email functionality
async function testEmailSystem() {
  console.log('STARTING COMPREHENSIVE EMAIL TEST');

  try {
    // Step 1: Create testing transporter with OAuth2
    console.log('\nStep 1: Setting up OAuth2 transporter');
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SMTP_USERNAME,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      }
    });

    // Step 2: Verify connection
    console.log('\nStep 2: Verifying SMTP connection');
    await transporter.verify();
    console.log('✓ SMTP connection successful');

    // Step 3: Send a test email
    console.log('\nStep 3: Sending test email');
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM, // Send to self for testing
      subject: 'SMTP Test - Direct Nodemailer',
      text: 'This is a test email sent directly using Nodemailer with OAuth2',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
          <h1 style="color: #444;">Email System Test</h1>
          <p>This is a <strong>test email</strong> sent directly using Nodemailer with OAuth2 authentication.</p>
          <p>If you can see this email, your basic email configuration is working correctly.</p>
          <hr>
          <p style="color: #888; font-size: 0.8em;">Sent on: ${new Date().toLocaleString()}</p>
        </div>
      `
    });

    console.log('✓ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\nEMAIL TESTING COMPLETE - Your email configuration is working correctly');
    
  } catch (error) {
    console.error('\n❌ EMAIL TEST FAILED:');
    console.error(error);
    
    if (error.code === 'EAUTH') {
      console.log('\nAuthentication Error: Please check your OAuth2 credentials');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\nTimeout Error: SMTP server connection timed out');
    }
  }
}

// Execute the test
testEmailSystem();