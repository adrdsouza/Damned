import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import nodemailer, { Transporter } from "nodemailer"
import { logger } from "@medusajs/framework"

// Store constants
const STORE = {
  NAME: process.env.STORE_NAME || "Damned Designs",
  URL: process.env.STORE_URL || "https://damneddesigns.com",
  ADMIN_URL: process.env.ADMIN_URL || "https://admin.damneddesigns.com",
  LOGO_URL: process.env.STORE_LOGO || "https://damneddesigns.com/Logo.svg",
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || "info@damneddesigns.com",
  ORDER_PREFIX: process.env.ORDER_PREFIX || "DD", // Prefix for order numbers
  COMPANY_ADDRESS: process.env.COMPANY_ADDRESS || "Damned Designs, 123 Main St, Anytown, USA"
}

// Email constants
const EMAIL = {
  USER: process.env.SMTP_USERNAME || process.env.EMAIL_USER || "info@damneddesigns.com",
  FROM: process.env.SMTP_FROM || process.env.EMAIL_FROM || "info@damneddesigns.com",
  ADMIN: process.env.EMAIL_ADMIN || "info@damneddesigns.com",
  REPLY_TO: process.env.EMAIL_REPLY_TO || process.env.SUPPORT_EMAIL || "info@damneddesigns.com"
}

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
}

// Create a singleton transporter to reuse across multiple emails
let emailTransporter: Transporter | null = null;

/**
 * Get or create the email transporter
 * This ensures we only create one transporter instance
 */
function getEmailTransporter(): Transporter {
  if (!emailTransporter) {
    emailTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: EMAIL.USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
      // Add pool configuration for better performance with multiple emails
      pool: true,
      maxConnections: 5,
      maxMessages: 100
    });
  }
  return emailTransporter;
}

/**
 * This subscriber handles sending shipment notification emails to customers
 * when their order (or part of it) has been shipped.
 * It listens for the shipment.created event.
 */
export default async function orderShipmentEmailHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  // Get the email transporter
  const transporter = getEmailTransporter();

  // Start tracking execution time for performance monitoring
  const startTime = Date.now();

  try {
    logger.info(`Processing shipment notification for fulfillment ${data.id}`);

    const query = container.resolve("query");

    // Get fulfillment data with all necessary relations in a single query
    const { data: fulfillmentData } = await query.graph({
      entity: "fulfillment",
      filters: { id: data.id },
      fields: [
        "id",
        "tracking_numbers",
        "order_id",
        "order.display_id",
        "order.email",
        "order.created_at",
        "order.customer.*",
        "order.items.*",
        "order.shipping_address.*",
        "labels.*",
        "items.*",
        "order_id",
        "shipped_at"
      ],
    });

    const fulfillment = fulfillmentData[0];

    // Validate fulfillment data
    if (!fulfillment) {
      logger.warn(`No fulfillment found with ID ${data.id}, skipping shipment notification`);
      return;
    }

    const order = fulfillment?.order;

    // Validate order data
    if (!order) {
      logger.warn(`No order found for fulfillment ${data.id}, skipping shipment notification`);
      return;
    }

    // Validate customer email
    if (!order.email) {
      logger.warn(`No email found for order ${order.id}, skipping shipment notification`);
      return;
    }

    // Format tracking information
    let trackingInfo = "";
    const trackingNumbers = fulfillment?.labels || [];

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
    const shippedItems = fulfillment.items.map(item => {
      const title = item?.title || "Product";
      return `<tr>
        <td style="${STYLES.tableCell}">${title}</td>
        <td style="${STYLES.tableCellCenter}">${item?.quantity}</td>
      </tr>`;
    }).join("");

    // Format shipping address
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
            <p><strong>Shipped Date:</strong> ${new Date(fulfillment?.shipped_at || new Date()).toLocaleDateString()}</p>
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

    // Send shipment notification email to customer
    const info = await transporter.sendMail({
      from: EMAIL.FROM,
      to: order.email,
      replyTo: EMAIL.REPLY_TO,
      subject: `Your ${STORE.NAME} Order Has Shipped - ${STORE.ORDER_PREFIX}${order?.display_id}`,
      html: shipmentHtml,
      // Add text version for better deliverability
      text: `
Your ${STORE.NAME} Order Has Shipped!

Hello ${customerName},

Great news! Your order (or part of it) has been shipped and is on its way to you.

Order Information:
- Order Number: ${STORE.ORDER_PREFIX}${order?.display_id}
- Order Date: ${new Date(order?.created_at).toLocaleDateString()}
- Shipped Date: ${new Date(fulfillment?.shipped_at || new Date()).toLocaleDateString()}

${trackingNumbers.length > 0 ? 'Tracking Information:\n' +
  trackingNumbers.map(label => `- Tracking Number: ${label?.tracking_number}`).join('\n') : ''}

Items Shipped:
${fulfillment.items.map(item => `- ${item?.title || 'Product'} (Qty: ${item?.quantity})`).join('\n')}

Shipping Address:
${shippingAddress?.address_1 || ''}
${shippingAddress?.address_2 ? shippingAddress.address_2 + '\n' : ''}
${shippingAddress?.city || ''}, ${shippingAddress?.province || ''} ${shippingAddress?.postal_code || ''}
${shippingAddress?.country_code || ''}

If you have any questions about your shipment, please don't hesitate to contact our customer service team at ${STORE.SUPPORT_EMAIL}.

Thank you for shopping with ${STORE.NAME}!
      `,
      headers: {
        'X-Entity-Ref-ID': `shipment-${data.id}`, // Prevent duplicate emails
      }
    });

    const executionTime = Date.now() - startTime;
    logger.info(`Shipment notification email sent to ${order.email} for order ${order.id} (MessageID: ${info.messageId}, Time: ${executionTime}ms)`);

    // Send a copy to admin if configured
    if (process.env.SEND_ADMIN_SHIPMENT_COPY === 'true') {
      await transporter.sendMail({
        from: EMAIL.FROM,
        to: EMAIL.ADMIN,
        subject: `[ADMIN COPY] Shipment Notification - ${STORE.ORDER_PREFIX}${order?.display_id}`,
        html: shipmentHtml,
        headers: {
          'X-Entity-Ref-ID': `shipment-admin-${data.id}`, // Prevent duplicate emails
        }
      });
      logger.info(`Admin copy of shipment notification sent for order ${order.id}`);
    }

  } catch (error) {
    logger.error(`Failed to send shipment notification email for fulfillment ${data.id}:`, error);

    // Attempt to send error notification to admin
    try {
      await transporter.sendMail({
        from: EMAIL.FROM,
        to: EMAIL.ADMIN,
        subject: `[ERROR] Failed to send shipment notification for fulfillment ${data.id}`,
        text: `An error occurred while sending shipment notification email:

Error: ${error.message}
Stack: ${error.stack}

Please check the logs for more details.`,
      });
    } catch (emailError) {
      logger.error(`Failed to send error notification email:`, emailError);
    }
  }
}

export const config: SubscriberConfig = {
  event: "shipment.created",
}
