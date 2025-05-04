/**
 * Email Template Test Script
 * 
 * This script tests all email templates by rendering and sending test emails.
 * Run this script to verify that all email templates are working correctly.
 */

const nodemailer = require('nodemailer');
const pug = require('pug');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const SMTP_USERNAME = process.env.SMTP_USERNAME;
const SMTP_FROM = process.env.SMTP_FROM;

// Mock order data - will be used for all tests
const mockOrder = {
  id: "order_test_123",
  display_id: "12345",
  email: SMTP_USERNAME, // Send to your own email for testing
  created_at: new Date().toISOString(),
  subtotal: 10000, // Cents
  shipping_total: 500, // Cents
  tax_total: 200, // Cents 
  total: 10700, // Cents
  refunded_total: 5000, // Cents for refund test
  items: [
    {
      id: "item_1",
      title: "Test Knife",
      product_title: "Test Knife Model X",
      unit_price: 10000,
      quantity: 1
    }
  ],
  shipping_address: {
    first_name: "Test",
    last_name: "User",
    address_1: "123 Test St",
    address_2: "Apt 4",
    city: "Testville",
    province: "TS",
    postal_code: "12345",
    country_code: "US"
  },
  shipment: {
    id: "ship_123",
    tracking_numbers: ["123456789USPS"],
    tracking_links: ["https://tools.usps.com/go/TrackConfirmAction?tLabels=123456789USPS"],
    shipping_method: {
      name: "USPS Priority Mail"
    }
  },
  refunds: [
    {
      id: "refund_123",
      amount: 5000,
      reason: "Customer request",
      note: "Customer changed their mind"
    }
  ],
  payment_status: "refunded"
};

// Mock customer data for password reset test
const mockCustomer = {
  id: "cus_123",
  email: SMTP_USERNAME,
  token: "reset_token_123456789",
  frontendUrl: "https://damneddesigns.com"
};

// Initialize a nodemailer transporter for direct testing
const getTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.SMTP_USERNAME,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    }
  });
  return transporter;
};

// Test rendering a specific template with mock data
const testRenderTemplate = async (templateName, data) => {
  console.log(`Testing render of ${templateName} template...`);
  
  const templateDir = path.join(__dirname, "backend/data/emailTemplates", templateName);
  const htmlTemplatePath = path.join(templateDir, "html.pug");
  const subjectTemplatePath = path.join(templateDir, "subject.pug");
  
  if (!fs.existsSync(htmlTemplatePath) || !fs.existsSync(subjectTemplatePath)) {
    console.error(`❌ Template files not found in ${templateDir}`);
    return null;
  }
  
  try {
    const compiledHtml = pug.compileFile(htmlTemplatePath);
    const compiledSubject = pug.compileFile(subjectTemplatePath);
    
    const html = compiledHtml({ data });
    const subject = compiledSubject({ data }).trim();
    
    console.log(`✅ Successfully rendered ${templateName} template`);
    console.log(`📧 Subject: ${subject}`);
    
    return { html, subject };
  } catch (error) {
    console.error(`❌ Error rendering ${templateName} template:`, error);
    return null;
  }
};

// Send a test email using a specific template
const sendTestEmail = async (templateName, data) => {
  console.log(`\n🔄 Testing ${templateName} email...`);
  
  const rendered = await testRenderTemplate(templateName, data);
  if (!rendered) return false;
  
  try {
    const transporter = getTransporter();
    await transporter.verify();
    
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to: data.email,
      bcc: SMTP_USERNAME,
      subject: rendered.subject,
      html: rendered.html
    });
    
    console.log(`✅ ${templateName} test email sent successfully!`);
    console.log(`📨 Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send ${templateName} test email:`, error);
    return false;
  }
};

// Main function to test all email templates
const testAllEmailTemplates = async () => {
  console.log("🚀 Starting email template tests...");
  
  // Test each template
  await sendTestEmail("orderplaced", mockOrder);
  await sendTestEmail("ordershipped", mockOrder);
  await sendTestEmail("orderupdated", mockOrder);
  await sendTestEmail("ordercanceled", mockOrder);
  await sendTestEmail("orderrefunded", mockOrder);
  await sendTestEmail("passwordreset", mockCustomer);
  
  console.log("\n✅ Email template testing complete!");
};

// Only run if executed directly
if (require.main === module) {
  // Check if required environment variables are set
  const requiredEnvVars = [
    "SMTP_USERNAME", 
    "SMTP_FROM", 
    "GOOGLE_CLIENT_ID", 
    "GOOGLE_CLIENT_SECRET", 
    "GOOGLE_REFRESH_TOKEN"
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:", missingVars.join(", "));
    console.error("Please set these variables and try again.");
    process.exit(1);
  }
  
  // Run the tests
  testAllEmailTemplates()
    .then(() => {
      console.log("🏁 All done!");
      process.exit(0);
    })
    .catch(error => {
      console.error("❌ Unexpected error during testing:", error);
      process.exit(1);
    });
}

module.exports = { testAllEmailTemplates, sendTestEmail, testRenderTemplate };