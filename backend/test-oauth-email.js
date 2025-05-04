const nodemailer = require('nodemailer');
require('dotenv').config();

// Log the OAuth2 configuration (without showing sensitive values)
console.log('OAuth2 Email Configuration:');
console.log('SMTP_USERNAME:', process.env.SMTP_USERNAME);
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set (value hidden)' : 'Not set');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set (value hidden)' : 'Not set');
console.log('GOOGLE_REFRESH_TOKEN:', process.env.GOOGLE_REFRESH_TOKEN ? 'Set (value hidden)' : 'Not set');
console.log('SMTP_FROM:', process.env.SMTP_FROM);

async function testOAuth2Email() {
  console.log('\nTesting OAuth2 Email Configuration...');
  
  try {
    // Create OAuth2 transporter
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
      },
      debug: true // Enable debug output
    });

    // Verify connection configuration
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✓ SMTP connection successful');

    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USERNAME,
      to: process.env.EMAIL_ADMIN || process.env.SMTP_USERNAME,
      subject: 'OAuth2 Email Test',
      text: 'This is a test email sent using OAuth2 authentication.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <h1 style="color: #333;">OAuth2 Email Test</h1>
          <p>This is a test email sent using OAuth2 authentication.</p>
          <p>If you're seeing this, the OAuth2 configuration is working correctly!</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    console.log('✓ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return true;
  } catch (error) {
    console.error('❌ Error testing OAuth2 email:');
    console.error(error);
    
    if (error.code === 'EAUTH') {
      console.error('\nAuthentication failed. Please check your OAuth2 credentials.');
    }
    
    return false;
  }
}

// Run the test
testOAuth2Email()
  .then(success => {
    if (success) {
      console.log('\n✅ OAuth2 email configuration is working correctly!');
    } else {
      console.log('\n❌ OAuth2 email configuration test failed. Please check the errors above.');
    }
  });
