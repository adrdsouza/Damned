const nodemailer = require('nodemailer');
const path = require('path');
const EmailTemplates = require('email-templates');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

// Test data for different email types
const testData = {
  orderPlaced: {
    email: 'test@example.com',
    display_id: '12345',
    created_at: new Date().toISOString(),
    subtotal: 10000, // $100.00
    shipping_total: 500, // $5.00
    tax_total: 1500, // $15.00
    total: 12000, // $120.00
    items: [
      { 
        title: 'Test Product 1', 
        quantity: 1, 
        unit_price: 10000 
      }
    ],
    shipping_address: {
      first_name: 'John',
      last_name: 'Doe',
      address_1: '123 Test Street',
      city: 'Testville',
      province: 'TS',
      postal_code: '12345',
      country_code: 'US'
    }
  },
  
  passwordReset: {
    email: 'test@example.com',
    link: 'https://damneddesigns.com/reset-password?token=testtokenxxxxxx',
  },
  
  invitation: {
    email: 'admin@example.com',
    invite_link: 'https://admin.damneddesigns.com/invite?token=invitetokenxxxxxx',
  },
  
  orderShipped: {
    email: 'test@example.com',
    display_id: '12345',
    total: 12000,
    items: [
      { 
        title: 'Test Product 1', 
        quantity: 1 
      }
    ],
    shipping_methods: [
      { shipping_option: { name: 'Standard Shipping' } }
    ],
    fulfillments: [
      { 
        tracking_numbers: ['TRK123456789'],
        tracking_links: [{ url: 'https://tracking.service.com/TRK123456789' }]
      }
    ]
  },
  
  orderCanceled: {
    email: 'test@example.com',
    display_id: '12345',
    created_at: new Date().toISOString(),
    total: 12000,
    payments: [{ amount: 12000 }]
  },
  
  orderReturn: {
    email: 'test@example.com',
    display_id: '12345',
    items: [
      { 
        title: 'Test Product 1', 
        return_quantity: 1 
      }
    ]
  },
  
  giftCard: {
    email: 'test@example.com',
    code: 'GIFT-CARD-123456',
    value: 5000, // $50.00
    balance: 5000,
    ends_at: null, // Never expires
    message: 'Happy Birthday! Enjoy your gift card!'
  },
  
  swap: {
    email: 'test@example.com',
    id: 'swap_123456',
    order_id: '12345',
    created_at: new Date().toISOString(),
    return_order: {
      items: [
        { 
          item: { title: 'Product to Return' }, 
          quantity: 1 
        }
      ]
    },
    additional_items: [
      { 
        title: 'Replacement Product', 
        quantity: 1 
      }
    ]
  }
};

async function testEmailTemplates() {
  console.log('===============================================');
  console.log('STARTING COMPREHENSIVE EMAIL TEMPLATES TEST');
  console.log('===============================================\n');

  try {
    // Create transporter with OAuth2 (same as in production)
    console.log('Setting up OAuth2 transporter...');
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
      }
    });

    // Verify connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✓ SMTP connection successful\n');

    // Path to email templates
    const templatesPath = path.join(__dirname, 'backend', 'data', 'emailTemplates');
    
    // Test each template one by one
    const templates = [
      { name: 'orderplaced', data: testData.orderPlaced, recipient: process.env.SMTP_FROM },
      { name: 'password-reset', data: testData.passwordReset, recipient: process.env.SMTP_FROM },
      { name: 'invite', data: testData.invitation, recipient: process.env.SMTP_FROM },
      { name: 'order-shipped', data: testData.orderShipped, recipient: process.env.SMTP_FROM },
      { name: 'order-canceled', data: testData.orderCanceled, recipient: process.env.SMTP_FROM },
      { name: 'order-return', data: testData.orderReturn, recipient: process.env.SMTP_FROM },
      { name: 'gift-card-created', data: testData.giftCard, recipient: process.env.SMTP_FROM },
      { name: 'swap-created', data: testData.swap, recipient: process.env.SMTP_FROM }
    ];

    // Process each template
    for (const template of templates) {
      console.log(`Testing template: ${template.name}`);
      
      try {
        // Create email renderer
        const email = new EmailTemplates({
          message: {
            from: process.env.SMTP_FROM
          },
          transport: transporter,
          views: {
            root: templatesPath
          },
          send: true // Actually send the email
        });
        
        // Send email with template
        const info = await email.send({
          template: template.name,
          message: {
            to: template.recipient, // Send to self for testing
            subject: `Test - ${template.name}` // Override subject for testing
          },
          locals: {
            data: template.data,
            env: process.env
          }
        });
        
        console.log(`✓ Email sent successfully for template: ${template.name}`);
        console.log(`  Message ID: ${info.messageId}`);
      } catch (templateError) {
        console.error(`✗ Failed to send email for template: ${template.name}`);
        console.error(`  Error: ${templateError.message}`);
        
        // Check if template exists
        console.log(`  Checking template directory: ${path.join(templatesPath, template.name)}`);
        // Continue testing other templates
      }
      
      console.log(''); // Add spacing between template tests
    }
    
    console.log('===============================================');
    console.log('EMAIL TEMPLATES TESTING COMPLETE');
    console.log('===============================================');
    
  } catch (error) {
    console.error('ERROR DURING EMAIL TESTING:');
    console.error(error);
  }
}

// Execute the test
testEmailTemplates();