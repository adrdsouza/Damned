const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSimpleRegistrationEmail() {
  console.log("Testing simple registration email...");
  
  // Create transporter with Gmail and App Password
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "info@damneddesigns.com",
      pass: process.env.EMAIL_PASS || "epmq fknl jdwh wtkr",
    }
  });
  
  try {
    // Verify connection
    await transporter.verify();
    console.log("✓ SMTP connection verified");
    
    // Send a simple test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "info@damneddesigns.com",
      to: process.env.EMAIL_ADMIN || "info@damneddesigns.com",
      subject: "Welcome to Damned Designs - Test",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <h1 style="color: #333; text-align: center;">Welcome to Damned Designs!</h1>
          <p>This is a test welcome email for new user registration.</p>
          <p>If you're receiving this email, the registration email system is working correctly.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #888; font-size: 0.8em; text-align: center;">Sent on: ${new Date().toLocaleString()}</p>
        </div>
      `
    });
    
    console.log("✓ Test registration email sent successfully");
    console.log("Message ID:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending registration email:", error);
    return false;
  }
}

// Run the test
testSimpleRegistrationEmail();
