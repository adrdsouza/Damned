const nodemailer = require('nodemailer');

async function testGmailEmail() {
  console.log("Testing Gmail email with App Password...");
  
  // Create transporter with Gmail and App Password
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "alishanwd1@gmail.com",
      pass: "epmq fknl jdwh wtkr", // App Password, NOT Gmail password
    }
  });
  
  try {
    // Verify connection
    await transporter.verify();
    console.log("✓ SMTP connection verified");
    
    // Send a simple test email
    const info = await transporter.sendMail({
      from: "alishanwd1@gmail.com",
      to: "alishanwd1@gmail.com", // Send to yourself for testing
      subject: "Medusa Order Email Test",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <h1 style="color: #333; text-align: center;">Test Email</h1>
          <p>This is a test email from your Medusa e-commerce system.</p>
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
