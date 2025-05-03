const nodemailer = require('nodemailer');
require('dotenv').config();

// Store constants
const STORE = {
  NAME: process.env.STORE_NAME || "Damned Designs",
  URL: process.env.STORE_URL || "https://damneddesigns.com",
  ADMIN_URL: process.env.ADMIN_URL || "https://admin.damneddesigns.com",
  LOGO_URL: process.env.STORE_LOGO || "https://damneddesigns.com/Logo.svg",
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || "info@damneddesigns.com",
  ORDER_PREFIX: process.env.ORDER_PREFIX || "DD",
  COMPANY_ADDRESS: process.env.COMPANY_ADDRESS || "Damned Designs, 123 Main St, Anytown, USA"
};

// Email constants
const EMAIL = {
  USER: process.env.EMAIL_USER || "alishanwd1@gmail.com",
  PASS: process.env.EMAIL_PASS || "epmq fknl jdwh wtkr",
  FROM: process.env.EMAIL_FROM || "alishanwd1@gmail.com",
  ADMIN: process.env.EMAIL_ADMIN || "alishanwd1@gmail.com",
  REPLY_TO: process.env.EMAIL_REPLY_TO || process.env.SUPPORT_EMAIL || "info@damneddesigns.com"
};

// Email template styles
const STYLES = {
  container: "font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;",
  header: "text-align: center; margin-bottom: 20px;",
  logo: "max-width: 200px; height: auto;",
  title: "color: #333; margin-top: 15px;",
  content: "padding: 20px 0;",
  infoBox: "background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;",
  trackingBox: "background-color: #f0f7ff; padding: 15px; border-radius: 4px; margin: 20px 0;",
  table: "width: 100%; border-collapse: collapse; margin: 20px 0;",
  tableHeader: "background-color: #f5f5f5;",
  tableHeaderCell: "padding: 10px; text-align: left; border-bottom: 2px solid #ddd;",
  tableCell: "padding: 10px; border-bottom: 1px solid #eee;",
  tableCellCenter: "padding: 10px; border-bottom: 1px solid #eee; text-align: center;",
  button: "background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;",
  footer: "margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #666;",
  link: "color: #0066cc; text-decoration: underline;"
};

// Mock data for testing
const mockFulfillment = {
  id: "fulfillment_test_123",
  shipped_at: new Date().toISOString(),
  labels: [
    {
      tracking_number: "1Z999AA10123456784",
      tracking_url: "https://www.ups.com/track?tracknum=1Z999AA10123456784"
    },
    {
      tracking_number: "1Z999AA10123456785",
      tracking_url: "https://www.ups.com/track?tracknum=1Z999AA10123456785"
    }
  ],
  items: [
    {
      title: "Damascus Knife - Tanto",
      quantity: 1
    },
    {
      title: "Damascus Knife - Drop Point",
      quantity: 2
    }
  ],
  order: {
    id: "order_test_123",
    display_id: "12345",
    email: EMAIL.ADMIN, // Send to yourself for testing
    created_at: new Date().toISOString(),
    customer: {
      first_name: "Test",
      last_name: "Customer",
      email: EMAIL.ADMIN
    },
    shipping_address: {
      first_name: "Test",
      last_name: "Customer",
      address_1: "123 Test St",
      address_2: "Apt 4",
      city: "Test City",
      province: "Test State",
      postal_code: "12345",
      country_code: "US"
    }
  }
};

async function testImprovedShipmentEmail() {
  console.log("Testing improved shipment notification email...");
  console.log("Email configuration:");
  console.log("EMAIL_USER:", EMAIL.USER);
  console.log("EMAIL_FROM:", EMAIL.FROM);
  console.log("EMAIL_ADMIN:", EMAIL.ADMIN);
  console.log("STORE_NAME:", STORE.NAME);
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL.USER,
      pass: EMAIL.PASS,
    },
    pool: true,
    maxConnections: 5
  });
  
  try {
    // Verify connection
    await transporter.verify();
    console.log("✓ SMTP connection verified");
    
    // Start tracking execution time
    const startTime = Date.now();
    
    // Format tracking information
    let trackingInfo = "";
    const trackingNumbers = mockFulfillment.labels || [];
    
    if (trackingNumbers.length > 0) {
      trackingInfo = `
        <div style="${STYLES.trackingBox}">
          <h2 style="${STYLES.title}">Tracking Information:</h2>
      `;
      
      for (const label of trackingNumbers) {
        const trackingNumber = label?.tracking_number;
        const trackingLink = label?.tracking_url;
        
        if (trackingNumber) {
          trackingInfo += `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>`;
          
          if (trackingLink && trackingLink !== "#") {
            trackingInfo += `<p><a href="${trackingLink}" style="${STYLES.link}">Track Your Package</a></p>`;
          }
        }
      }
      
      trackingInfo += `</div>`;
    }
    
    // Format shipped items
    const shippedItems = mockFulfillment.items.map(item => {
      const title = item?.title || "Product";
      return `<tr>
        <td style="${STYLES.tableCell}">${title}</td>
        <td style="${STYLES.tableCellCenter}">${item?.quantity}</td>
      </tr>`;
    }).join("");
    
    // Format shipping address
    const order = mockFulfillment.order;
    const shippingAddress = order.shipping_address;
    const formattedAddress = shippingAddress ? `
      <p>${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}</p>
      <p>${shippingAddress.address_1 || ''}</p>
      ${shippingAddress.address_2 ? `<p>${shippingAddress.address_2}</p>` : ''}
      <p>${shippingAddress.city || ''}, ${shippingAddress.province || ''} ${shippingAddress.postal_code || ''}</p>
      <p>${shippingAddress.country_code || ''}</p>
    ` : '<p>No shipping address provided</p>';
    
    // Get customer name
    const customerName = order.customer?.first_name || 
                         (shippingAddress ? shippingAddress.first_name : null) || 
                         'there';
    
    // Create shipment notification email HTML
    const shipmentHtml = `
      <div style="${STYLES.container}">
        <div style="${STYLES.header}">
          <img src="${STORE.LOGO_URL}" alt="${STORE.NAME}" style="${STYLES.logo}">
          <h1 style="${STYLES.title}">Your Order Has Shipped!</h1>
        </div>

        <div style="${STYLES.content}">
          <p>Hello ${customerName},</p>
          <p>Great news! Your order (or part of it) has been shipped and is on its way to you.</p>
          
          <div style="${STYLES.infoBox}">
            <h2 style="${STYLES.title}">Order Information:</h2>
            <p><strong>Order Number:</strong> ${STORE.ORDER_PREFIX}${order?.display_id}</p>
            <p><strong>Order Date:</strong> ${new Date(order?.created_at).toLocaleDateString()}</p>
            <p><strong>Shipped Date:</strong> ${new Date(mockFulfillment?.shipped_at || new Date()).toLocaleDateString()}</p>
          </div>
          
          ${trackingInfo}
          
          <h2 style="${STYLES.title}">Items Shipped:</h2>
          <table style="${STYLES.table}">
            <thead>
              <tr style="${STYLES.tableHeader}">
                <th style="${STYLES.tableHeaderCell}">Item</th>
                <th style="${STYLES.tableHeaderCell}">Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${shippedItems}
            </tbody>
          </table>
          
          <div style="${STYLES.infoBox}">
            <h2 style="${STYLES.title}">Shipping Address:</h2>
            ${formattedAddress}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${STORE.URL}/account/orders" style="${STYLES.button}">
              View Your Order
            </a>
          </div>
          
          <p>If you have any questions about your shipment, please don't hesitate to contact our customer service team at ${STORE.SUPPORT_EMAIL}.</p>
        </div>

        <div style="${STYLES.footer}">
          <p>Thank you for shopping with ${STORE.NAME}!</p>
          <p>${STORE.COMPANY_ADDRESS}</p>
          <p>© ${new Date().getFullYear()} ${STORE.NAME} - All rights reserved</p>
        </div>
      </div>
    `;
    
    // Create plain text version
    const plainText = `
Your ${STORE.NAME} Order Has Shipped!

Hello ${customerName},

Great news! Your order (or part of it) has been shipped and is on its way to you.

Order Information:
- Order Number: ${STORE.ORDER_PREFIX}${order?.display_id}
- Order Date: ${new Date(order?.created_at).toLocaleDateString()}
- Shipped Date: ${new Date(mockFulfillment?.shipped_at || new Date()).toLocaleDateString()}

${trackingNumbers.length > 0 ? 'Tracking Information:\n' + 
  trackingNumbers.map(label => `- Tracking Number: ${label?.tracking_number}`).join('\n') : ''}

Items Shipped:
${mockFulfillment.items.map(item => `- ${item?.title || 'Product'} (Qty: ${item?.quantity})`).join('\n')}

Shipping Address:
${shippingAddress?.address_1 || ''}
${shippingAddress?.address_2 ? shippingAddress.address_2 + '\n' : ''}
${shippingAddress?.city || ''}, ${shippingAddress?.province || ''} ${shippingAddress?.postal_code || ''}
${shippingAddress?.country_code || ''}

If you have any questions about your shipment, please don't hesitate to contact our customer service team at ${STORE.SUPPORT_EMAIL}.

Thank you for shopping with ${STORE.NAME}!
    `;

    // Send shipment notification email
    const info = await transporter.sendMail({
      from: EMAIL.FROM,
      to: order.email,
      replyTo: EMAIL.REPLY_TO,
      subject: `Your ${STORE.NAME} Order Has Shipped - ${STORE.ORDER_PREFIX}${order?.display_id}`,
      html: shipmentHtml,
      text: plainText,
      headers: {
        'X-Entity-Ref-ID': `test-shipment-${Date.now()}`, // Prevent duplicate emails
      }
    });
    
    const executionTime = Date.now() - startTime;
    console.log(`✓ Shipment notification email sent successfully (${executionTime}ms)`);
    console.log("Message ID:", info.messageId);
    
    return true;
  } catch (error) {
    console.error("❌ Error sending shipment notification email:", error);
    return false;
  }
}

// Run the test
testImprovedShipmentEmail();
