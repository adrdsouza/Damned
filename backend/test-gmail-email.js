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
  USER: process.env.EMAIL_USER || "alishanwd1@gmail.com",
  PASS: process.env.EMAIL_PASS || "epmq fknl jdwh wtkr",
  FROM: process.env.EMAIL_FROM || "alishanwd1@gmail.com",
  ADMIN: process.env.EMAIL_ADMIN || "alishanwd1@gmail.com"
}

async function testGmailEmail() {
  console.log("Testing Gmail email with App Password...");
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

    // Send a simple test email
    const info = await transporter.sendMail({
      from: EMAIL.FROM,
      to: EMAIL.ADMIN, // Send to yourself for testing
      subject: `${STORE.NAME} - Order Email Test`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${STORE.LOGO_URL}" alt="${STORE.NAME}" style="max-width: 200px; height: auto;">
            <h1 style="color: #333; text-align: center;">Test Email</h1>
          </div>
          <p>This is a test email from your ${STORE.NAME} e-commerce system.</p>
          <p>If you're receiving this email, your Gmail configuration with App Password is working correctly.</p>
          <p>You can now use this configuration to send order confirmation emails to customers and notifications to admins.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #888; font-size: 0.8em; text-align: center;">Sent on: ${new Date().toLocaleString()}</p>
        </div>
      `
    });

    console.log("✓ Test email sent successfully");
    console.log("Message ID:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
}

// Run the test
testGmailEmail();
