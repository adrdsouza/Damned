const nodemailer = require('nodemailer');
const { compile } = require('pug');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Get environment variables
const { 
  SMTP_FROM, 
  SMTP_USERNAME, 
  GOOGLE_CLIENT_ID, 
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN 
} = process.env;

// Create a transport
const transport = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: SMTP_USERNAME,
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    refreshToken: GOOGLE_REFRESH_TOKEN,
  }
};

// Create email data for the order
const mockOrderData = {
  id: 'order_12345',
  display_id: 'DD12345',
  email: SMTP_USERNAME,
  created_at: new Date().toISOString(),
  items: [
    {
      product_title: 'Test Product',
      title: 'Test Variant',
      quantity: 1,
      unit_price: 1000
    }
  ],
  subtotal: 1000,
  shipping_total: 500,
  tax_total: 150,
  total: 1650,
  shipping_address: {
    first_name: 'Test',
    last_name: 'User',
    address_1: '123 Test St',
    city: 'Test City',
    province: 'Test Province',
    postal_code: '12345',
    country_code: 'US'
  }
};

// Function to send the email
async function sendTestOrderEmail() {
  try {
    // Create the transporter
    const transporter = nodemailer.createTransport(transport);
    
    // Verify connection
    await transporter.verify();
    console.log('Email connection verified successfully');
    
    // Get template paths
    const templateDir = path.join(__dirname, 'data', 'emailTemplates', 'orderplaced');
    const htmlTemplate = path.join(templateDir, 'html.pug');
    const subjectTemplate = path.join(templateDir, 'subject.pug');
    
    // Check if templates exist
    if (!fs.existsSync(htmlTemplate)) {
      throw new Error(`HTML template not found: ${htmlTemplate}`);
    }
    if (!fs.existsSync(subjectTemplate)) {
      throw new Error(`Subject template not found: ${subjectTemplate}`);
    }
    
    // Compile templates
    const htmlContent = fs.readFileSync(htmlTemplate, 'utf8');
    const subjectContent = fs.readFileSync(subjectTemplate, 'utf8');
    
    const compiledHtml = compile(htmlContent);
    const compiledSubject = compile(subjectContent);
    
    // Render templates with data
    const html = compiledHtml({ data: mockOrderData });
    const subject = compiledSubject({ data: mockOrderData }).trim();
    
    // Send email
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to: mockOrderData.email,
      subject: subject,
      html: html
    });
    
    console.log('Order email sent successfully');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Error sending order email:', error);
  }
}

// Run the function
sendTestOrderEmail();