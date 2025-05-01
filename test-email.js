const nodemailer = require('nodemailer');
require('dotenv').config({ path: './backend/.env' });

// Log the email config
console.log('Email configuration:');
console.log('SMTP_FROM:', process.env.SMTP_FROM);
console.log('SMTP_USERNAME:', process.env.SMTP_USERNAME);
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set (value hidden)' : 'Not set');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set (value hidden)' : 'Not set');
console.log('GOOGLE_REFRESH_TOKEN:', process.env.GOOGLE_REFRESH_TOKEN ? 'Set (value hidden)' : 'Not set');

async function main() {
  // Create a test account if needed
  let testAccount = await nodemailer.createTestAccount();

  // Create OAuth2 transporter
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.SMTP_USERNAME,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    },
    logger: true,
    debug: true
  });

  try {
    // Check connection
    console.log('Verifying connection...');
    let connectionResult = await transporter.verify();
    console.log('SMTP connection verified:', connectionResult);

    // Try to send a test email
    console.log('Attempting to send test email...');
    let info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM, // Sending to self for testing
      subject: 'Damned Designs Test Email',
      text: 'This is a test email from Damned Designs SMTP configuration test',
      html: '<p>This is a test email from Damned Designs SMTP configuration test</p>',
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:');
    console.error(error);
  }
}

main().catch(console.error);