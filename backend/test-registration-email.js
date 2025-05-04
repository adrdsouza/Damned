const nodemailer = require('nodemailer');
require('dotenv').config();

// Store constants
const STORE = {
  NAME: process.env.STORE_NAME || "Damned Designs",
  URL: process.env.STORE_URL || "https://damneddesigns.com",
  LOGO_URL: process.env.STORE_LOGO || "https://damneddesigns.com/Logo.svg",
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || "info@damneddesigns.com"
}

// Email constants
const EMAIL = {
  USER: process.env.EMAIL_USER || "info@damneddesigns.com",
  PASS: process.env.EMAIL_PASS || "epmq fknl jdwh wtkr",
  FROM: process.env.EMAIL_FROM || "info@damneddesigns.com",
  ADMIN: process.env.EMAIL_ADMIN || "info@damneddesigns.com"
}

// Mock customer data for testing
const mockCustomer = {
  id: "cust_test_123",
  email: EMAIL.ADMIN, // Send to yourself for testing
  first_name: "Test",
  last_name: "User",
  created_at: new Date().toISOString()
};

async function testRegistrationEmail() {
  console.log("Testing user registration email...");
  console.log("Email configuration:");
  console.log("EMAIL_USER:", EMAIL.USER);
  console.log("EMAIL_FROM:", EMAIL.FROM);
  console.log("EMAIL_ADMIN:", EMAIL.ADMIN);
  console.log("STORE_NAME:", STORE.NAME);
  
  // Create transporter with Gmail and App Password
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL.USER,
      pass: EMAIL.PASS,
    }
  });
  
  try {
    // Verify connection
    await transporter.verify();
    console.log("✓ SMTP connection verified");
    
    // Create welcome email HTML
    const welcomeHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${STORE.LOGO_URL}" alt="${STORE.NAME}" style="max-width: 200px; height: auto;">
          <h1 style="color: #333;">Welcome to ${STORE.NAME}!</h1>
        </div>

        <div style="padding: 20px 0;">
          <p>Hello ${mockCustomer.first_name || 'there'},</p>
          <p>Thank you for creating an account with ${STORE.NAME}. We're excited to have you join our community!</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Your Account Information:</h2>
            <p><strong>Email:</strong> ${mockCustomer.email}</p>
            <p><strong>Name:</strong> ${mockCustomer.first_name || ''} ${mockCustomer.last_name || ''}</p>
            <p><strong>Date Joined:</strong> ${new Date(mockCustomer.created_at).toLocaleDateString()}</p>
          </div>
          
          <p>With your account, you can:</p>
          <ul style="padding-left: 20px; line-height: 1.6;">
            <li>Track your orders</li>
            <li>View your order history</li>
            <li>Update your profile information</li>
            <li>Save your shipping addresses</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${STORE.URL}/account" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Visit Your Account
            </a>
          </div>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our customer service team at ${STORE.SUPPORT_EMAIL}.</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #666;">
          <p>Thank you for choosing ${STORE.NAME}!</p>
          <p>© ${new Date().getFullYear()} ${STORE.NAME} - All rights reserved</p>
        </div>
      </div>
    `;
    
    // Send welcome email
    const info = await transporter.sendMail({
      from: EMAIL.FROM,
      to: mockCustomer.email,
      subject: `Welcome to ${STORE.NAME}!`,
      html: welcomeHtml,
    });
    
    console.log("✓ Welcome email sent successfully");
    console.log("Message ID:", info.messageId);
    
    // Create admin notification HTML
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${STORE.LOGO_URL}" alt="${STORE.NAME}" style="max-width: 200px; height: auto;">
          <h1 style="color: #333;">New Customer Registration</h1>
        </div>

        <div style="padding: 20px 0;">
          <p style="background-color: #f0f7ff; color: #0066cc; padding: 10px; border-radius: 4px; text-align: center; margin-bottom: 20px; font-size: 16px;">
            <strong>📣 ADMIN NOTIFICATION: New customer has registered</strong>
          </p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Customer Information:</h2>
            <p><strong>Customer ID:</strong> ${mockCustomer.id}</p>
            <p><strong>Email:</strong> ${mockCustomer.email}</p>
            <p><strong>Name:</strong> ${mockCustomer.first_name || ''} ${mockCustomer.last_name || ''}</p>
            <p><strong>Date Registered:</strong> ${new Date(mockCustomer.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #666;">
          <p>This is an automated notification from your ${STORE.NAME} e-commerce system.</p>
          <p>© ${new Date().getFullYear()} ${STORE.NAME} - All rights reserved</p>
        </div>
      </div>
    `;
    
    // Send admin notification
    const adminInfo = await transporter.sendMail({
      from: EMAIL.FROM,
      to: EMAIL.ADMIN,
      subject: `[ADMIN] New Customer Registration - ${mockCustomer.email}`,
      html: adminHtml,
    });
    
    console.log("✓ Admin notification sent successfully");
    console.log("Message ID:", adminInfo.messageId);
    
    return true;
  } catch (error) {
    console.error("❌ Error sending registration emails:", error);
    return false;
  }
}

// Run the test
testRegistrationEmail();
