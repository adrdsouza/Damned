const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config({path: './backend/.env'});

async function main() {
  try {
    console.log('Direct email test with HTML content');
    
    // Create transporter
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
    });
    
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('Connection verified!');
    
    // Create a simple HTML email template
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        h1 { color: #333; }
        .content { padding: 20px 0; }
        .order-summary { margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Test Order Confirmation</h1>
        </div>
        <div class="content">
          <p>Hello ${process.env.SMTP_USERNAME},</p>
          <p>Thank you for your test order with Damned Designs. This is a complete test of email functionality.</p>
          
          <div class="order-summary">
            <h2>Order Details:</h2>
            <p><strong>Order Number:</strong> TEST-123</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total:</strong> $16.50</p>
          </div>
          
          <p>If this email is received, the email system is working correctly.</p>
        </div>
        <div class="footer">
          <p>This is a test email for debugging purposes.</p>
        </div>
      </div>
    </body>
    </html>
    `;
    
    // Send mail
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM,
      subject: 'TEST ORDER - Direct HTML Template',
      html: htmlContent
    });
    
    console.log('Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();