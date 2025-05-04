const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const pug = require('pug');
require('dotenv').config({ path: './backend/.env' });

// Log the email config
console.log('Email configuration:');
console.log('SMTP_FROM:', process.env.SMTP_FROM);
console.log('SMTP_USERNAME:', process.env.SMTP_USERNAME);
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set (value hidden)' : 'Not set');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set (value hidden)' : 'Not set');
console.log('GOOGLE_REFRESH_TOKEN:', process.env.GOOGLE_REFRESH_TOKEN ? 'Set (value hidden)' : 'Not set');

// Test rendering order placed template
const templatePath = '/root/damneddesigns/backend/data/emailTemplates/orderplaced';
console.log('Testing template rendering from:', templatePath);

// Create mock order data similar to what Medusa would use
const mockOrderData = {
  id: 'order_123456',
  display_id: '12345',
  email: 'info@damneddesigns.com', // Using the admin email for testing
  shipping_address: {
    first_name: 'Test',
    last_name: 'Customer',
    address_1: '123 Test St',
    city: 'Test City',
    postal_code: '12345',
    country_code: 'US',
    province: 'CA' // Adding province for template
  },
  items: [
    {
      title: 'Test Product',
      quantity: 1,
      unit_price: 9900, // Added unit_price which is used in template
      product_title: 'Test Product',
      total: 9900,
      variant: {
        title: 'Default Variant',
        product: {
          title: 'Test Product'
        }
      }
    }
  ],
  shipping_methods: [
    {
      shipping_option: {
        name: 'Standard Shipping'
      },
      price: 500
    }
  ],
  metadata: {}, // Added metadata for template
  currency_code: 'usd',
  tax_total: 0,
  subtotal: 9900,
  shipping_total: 500,
  discount_total: 0,
  total: 10400,
  created_at: new Date()
};

// Format functions to simulate Medusa's formatters
const formatters = {
  formatMoney: (amount, currency) => {
    const divisor = 100;
    const dollars = amount / divisor;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'usd',
    }).format(dollars);
  }
};

async function testTemplate() {
  try {
    // Load HTML template
    const htmlTemplate = fs.readFileSync(path.join(templatePath, 'html.pug'), 'utf8');
    console.log('HTML template loaded successfully');
    
    // Load subject template
    const subjectTemplate = fs.readFileSync(path.join(templatePath, 'subject.pug'), 'utf8');
    console.log('Subject template loaded successfully');
    
    // Compile and render the templates
    const htmlCompiled = pug.compile(htmlTemplate);
    const subjectCompiled = pug.compile(subjectTemplate);
    
    // For email template, 'data' is used instead of 'order' in the template
    const html = htmlCompiled({
      data: mockOrderData,
      format: formatters.formatMoney
    });
    
    const subject = subjectCompiled({
      data: mockOrderData
    });
    
    console.log('Templates rendered successfully');
    console.log('Subject:', subject);
    
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

    // Send test email using the rendered template
    console.log('Sending test email with order template...');
    let info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM, // Sending to self for testing
      subject: subject || 'Test Order Confirmation',
      html: html,
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    return { success: true, info };
  } catch (error) {
    console.error('Error testing template:', error);
    return { success: false, error };
  }
}

async function main() {
  // First verify connection
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

  console.log('Verifying connection...');
  let connectionResult = await transporter.verify();
  console.log('SMTP connection verified:', connectionResult);

  // Test the template rendering and email sending
  const result = await testTemplate();
  
  if (result.success) {
    console.log('Complete test successful!');
  } else {
    console.error('Complete test failed.');
  }
}

main().catch(console.error);