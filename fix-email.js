const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

async function main() {
  try {
    console.log('Email Configuration Test');
    console.log('------------------------');
    console.log('SMTP_FROM:', process.env.SMTP_FROM);
    console.log('SMTP_USERNAME:', process.env.SMTP_USERNAME);
    console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set (truncated)' : 'Not set');
    console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set (truncated)' : 'Not set');
    console.log('GOOGLE_REFRESH_TOKEN:', process.env.GOOGLE_REFRESH_TOKEN ? 'Set (truncated)' : 'Not set');
    
    // Create a test transporter
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
      logger: true,
      debug: true
    });
    
    console.log('\nVerifying connection...');
    const verifyResult = await transporter.verify();
    console.log('Connection verified:', verifyResult);
    
    console.log('\nChecking Templates');
    console.log('------------------------');
    const templatePath = path.join(__dirname, 'backend', 'data', 'emailTemplates');
    console.log('Template directory:', templatePath);
    if (fs.existsSync(templatePath)) {
      console.log('Template directory exists');
      const templates = fs.readdirSync(templatePath);
      console.log('Available templates:', templates);
      
      // Check each template
      templates.forEach(template => {
        const templateDir = path.join(templatePath, template);
        if (fs.statSync(templateDir).isDirectory()) {
          console.log(`\nTemplate: ${template}`);
          const files = fs.readdirSync(templateDir);
          console.log(`Files: ${files.join(', ')}`);
        }
      });
    } else {
      console.log('Template directory does not exist!');
    }

    // Send a test email directly
    console.log('\nSending test email...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM,
      subject: 'Direct Test Email from fix-email.js',
      text: 'This is a direct test email sent from fix-email.js',
      html: '<p>This is a direct test email sent from fix-email.js</p>'
    });
    
    console.log('Email sent successfully');
    console.log('Message ID:', info.messageId);
    
    // Check medusa-config.ts
    console.log('\nChecking medusa-config.ts');
    const configPath = path.join(__dirname, 'backend', 'medusa-config.ts');
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf8');
      console.log('Config includes medusa-plugin-nodemailer:', configContent.includes('medusa-plugin-nodemailer'));
      console.log('Config includes enable_order_placed_emails:', configContent.includes('enable_order_placed_emails'));
      console.log('Config includes bcc_receiver:', configContent.includes('bcc_receiver'));
    }
    
    console.log('\nAll tests completed successfully. A test email should arrive shortly.');
  } catch (error) {
    console.error('ERROR:', error);
  }
}

main();