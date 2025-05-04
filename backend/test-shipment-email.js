const nodemailer = require('nodemailer');
require('dotenv').config();

// Store constants
const STORE = {
  NAME: process.env.STORE_NAME || "Damned Designs",
  URL: process.env.STORE_URL || "https://damneddesigns.com",
  LOGO_URL: process.env.STORE_LOGO || "https://damneddesigns.com/Logo.svg",
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || "support@damneddesigns.com",
  ORDER_PREFIX: "DD"
}

// Email constants
const EMAIL = {
  USER: process.env.EMAIL_USER || "info@damneddesigns.com",
  PASS: process.env.EMAIL_PASS || "epmq fknl jdwh wtkr",
  FROM: process.env.EMAIL_FROM || "info@damneddesigns.com",
  ADMIN: process.env.EMAIL_ADMIN || "info@damneddesigns.com"
}

// Mock order data for testing
const mockOrder = {
  id: "order_test_123",
  display_id: "12345",
  email: EMAIL.ADMIN, // Send to yourself for testing
  created_at: new Date().toISOString(),
  customer: {
    first_name: "Test",
    last_name: "Customer"
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
  },
  items: [
    {
      id: "item_1",
      title: "Test Product 1",
      product_title: "Test Product 1",
      quantity: 2
    },
    {
      id: "item_2",
      title: "Test Product 2",
      product_title: "Test Product 2",
      quantity: 1
    }
  ]
};

// Mock fulfillment data for testing
const mockFulfillment = {
  id: "fulfillment_test_123",
  tracking_numbers: ["1Z999AA10123456784"],
  tracking_links: ["https://www.ups.com/track?tracknum=1Z999AA10123456784"],
  shipped_at: new Date().toISOString(),
  items: [
    {
      item_id: "item_1",
      quantity: 2
    },
    {
      item_id: "item_2",
      quantity: 1
    }
  ]
};

async function testShipmentEmail() {
  console.log("Testing order shipment notification email...");
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
    
    // Format tracking information
    let trackingInfo = ""
    if (mockFulfillment.tracking_numbers && mockFulfillment.tracking_numbers.length > 0) {
      trackingInfo = `
        <div style="background-color: #f0f7ff; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Tracking Information:</h2>
      `
      
      for (let i = 0; i < mockFulfillment.tracking_numbers.length; i++) {
        const trackingNumber = mockFulfillment.tracking_numbers[i]
        const trackingLink = mockFulfillment.tracking_links && mockFulfillment.tracking_links[i] 
          ? mockFulfillment.tracking_links[i] 
          : null
          
        trackingInfo += `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>`
        
        if (trackingLink) {
          trackingInfo += `<p><a href="${trackingLink}" style="color: #0066cc; text-decoration: underline;">Track Your Package</a></p>`
        }
      }
      
      trackingInfo += `</div>`
    }

    // Format shipped items
    const shippedItems = mockFulfillment.items.map(item => {
      const orderItem = mockOrder.items.find(oi => oi.id === item.item_id)
      const title = orderItem?.product_title || orderItem?.title || "Product"
      return `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      </tr>`
    }).join("")
    
    // Create shipment notification email HTML
    const shipmentHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${STORE.LOGO_URL}" alt="${STORE.NAME}" style="max-width: 200px; height: auto;">
          <h1 style="color: #333;">Your Order Has Shipped!</h1>
        </div>

        <div style="padding: 20px 0;">
          <p>Hello ${mockOrder.customer?.first_name || 'there'},</p>
          <p>Great news! Your order (or part of it) has been shipped and is on its way to you.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Order Information:</h2>
            <p><strong>Order Number:</strong> ${STORE.ORDER_PREFIX}${mockOrder.display_id}</p>
            <p><strong>Order Date:</strong> ${new Date(mockOrder.created_at).toLocaleDateString()}</p>
            <p><strong>Shipped Date:</strong> ${new Date(mockFulfillment.shipped_at).toLocaleDateString()}</p>
          </div>
          
          ${trackingInfo}
          
          <h2 style="color: #333;">Items Shipped:</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${shippedItems}
            </tbody>
          </table>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Shipping Address:</h2>
            <p>${mockOrder.shipping_address?.first_name || ''} ${mockOrder.shipping_address?.last_name || ''}</p>
            <p>${mockOrder.shipping_address?.address_1 || ''}</p>
            ${mockOrder.shipping_address?.address_2 ? `<p>${mockOrder.shipping_address.address_2}</p>` : ''}
            <p>${mockOrder.shipping_address?.city || ''}, ${mockOrder.shipping_address?.province || ''} ${mockOrder.shipping_address?.postal_code || ''}</p>
            <p>${mockOrder.shipping_address?.country_code || ''}</p>
          </div>
          
          <p>If you have any questions about your shipment, please don't hesitate to contact our customer service team at ${STORE.SUPPORT_EMAIL}.</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #666;">
          <p>Thank you for shopping with ${STORE.NAME}!</p>
          <p>© ${new Date().getFullYear()} ${STORE.NAME} - All rights reserved</p>
        </div>
      </div>
    `;
    
    // Send shipment notification email
    const info = await transporter.sendMail({
      from: EMAIL.FROM,
      to: mockOrder.email,
      subject: `Your ${STORE.NAME} Order Has Shipped - ${STORE.ORDER_PREFIX}${mockOrder.display_id}`,
      html: shipmentHtml,
    });
    
    console.log("✓ Shipment notification email sent successfully");
    console.log("Message ID:", info.messageId);
    
    return true;
  } catch (error) {
    console.error("❌ Error sending shipment notification email:", error);
    return false;
  }
}

// Run the test
testShipmentEmail();
