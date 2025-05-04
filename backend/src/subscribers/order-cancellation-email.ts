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
  cancelBox: "background-color: #fff0f0; padding: 15px; border-radius: 4px; margin: 20px 0; border: 1px solid #ffcccc;",
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
 * This subscriber handles sending order cancellation notification emails to customers
 * when their order has been canceled.
 * It listens for the order.canceled event.
 */
export default async function orderCancellationEmailHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  // Get the email transporter
  const transporter = getEmailTransporter();

  // Start tracking execution time for performance monitoring (commented out as not used)
  // const startTime = Date.now();

  try {

    logger.info(`Processing order cancellation notification for order ${data.id}`);

    const query = container.resolve("query");

    // Get order data with all necessary relations in a single query
    const { data: orderData } = await query.graph({
      entity: "order",
      filters: { id: data.id },
      fields: [
        "id",
        "display_id",
        "email",
        "created_at",
        "updated_at",
        "canceled_at",
        "status",
        "customer.*",
        "items.*",
        "shipping_address.*",
        "billing_address.*",
        "subtotal",
        "shipping_total",
        "tax_total",
        "discount_total",
        "total",
        "metadata"
      ],
    });

    // Use type assertion to handle extended Order properties
    const order = orderData[0] as any;
    // Validate order data
    if (!order) {
      logger.warn(`No order found with ID ${data.id}, skipping cancellation notification`);
      return;
    }

    // Validate customer email
    if (!order.email) {
      logger.warn(`No email found for order ${order.id}, skipping cancellation notification`);
      return;
    }

    // Get cancellation reason if available in metadata
    const cancellationReason = order.metadata?.cancellation_reason || "The order has been canceled.";

    // Format order items
    const orderItems = order.items?.map(item => {
      const title = item?.title || item?.product_title || "Product";
      const quantity = getNumber(item?.quantity || 0);
      const unitPrice = getNumber(item?.unit_price || 0);
      const total = (quantity * unitPrice); // Convert from cents to dollars

      return `<tr>
        <td style="${STYLES.tableCell}">${title}</td>
        <td style="${STYLES.tableCellCenter}">${quantity}</td>
        <td style="${STYLES.tableCellCenter}">$${(unitPrice).toFixed(2)}</td>
        <td style="${STYLES.tableCellCenter}">$${total.toFixed(2)}</td>
      </tr>`;
    }).join("") || "";

    // Format shipping address
    const shippingAddress = order.shipping_address;

    // Get customer name
    const customerName = order.customer?.first_name ||
                         (shippingAddress ? shippingAddress.first_name : null) ||
                         'there';

    // Create order cancellation notification email HTML
    const cancellationHtml = `
      <div style="${STYLES.container}">
        <div style="${STYLES.header}">
          <img src="${STORE.LOGO_URL}" alt="${STORE.NAME}" style="${STYLES.logo}">
          <h1 style="${STYLES.title}">Your Order Has Been Canceled</h1>
        </div>

        <div style="${STYLES.content}">
          <p>Hello ${customerName},</p>
          <p>We're writing to inform you that your order has been canceled.</p>

          <div style="${STYLES.cancelBox}">
            <h2 style="${STYLES.title}">Cancellation Information:</h2>
            <p><strong>Reason:</strong> ${cancellationReason}</p>
            <p><strong>Canceled On:</strong> ${new Date(order?.canceled_at || order?.updated_at).toLocaleDateString()}</p>
          </div>

          <div style="${STYLES.infoBox}">
            <h2 style="${STYLES.title}">Order Information:</h2>
            <p><strong>Order Number:</strong> ${STORE.ORDER_PREFIX}${order?.display_id}</p>
            <p><strong>Order Date:</strong> ${new Date(order?.created_at).toLocaleDateString()}</p>
          </div>

          <h2 style="${STYLES.title}">Order Items:</h2>
          <table style="${STYLES.table}">
            <thead>
              <tr style="${STYLES.tableHeader}">
                <th style="${STYLES.tableHeaderCell}">Item</th>
                <th style="${STYLES.tableHeaderCell}">Quantity</th>
                <th style="${STYLES.tableHeaderCell}">Price</th>
                <th style="${STYLES.tableHeaderCell}">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems}
            </tbody>
          </table>

          <div style="margin: 20px 0; text-align: right;">
            <p><strong>Subtotal:</strong> $${(getNumber(order.subtotal) ).toFixed(2)}</p>
            <p><strong>Shipping:</strong> $${(getNumber(order.shipping_total)).toFixed(2)}</p>
            <p><strong>Tax:</strong> $${(getNumber(order.tax_total) ).toFixed(2)}</p>
            ${getNumber(order.discount_total) > 0 ? `<p><strong>Discount:</strong> -$${(getNumber(order.discount_total)).toFixed(2)}</p>` : ''}
            <p style="font-size: 18px; margin-top: 10px; border-top: 2px solid #ddd; padding-top: 10px;">
              <strong>Total:</strong> $${(getNumber(order.subtotal )).toFixed(2)}
            </p>
          </div>

          <p>If you have any questions about this cancellation, please don't hesitate to contact our customer service team at ${STORE.SUPPORT_EMAIL}.</p>

          <p>If you believe this cancellation was made in error, please contact us as soon as possible.</p>
        </div>

        <div style="${STYLES.footer}">
          <p>Thank you for your understanding.</p>
          <p>${STORE.COMPANY_ADDRESS}</p>
          <p>© ${new Date().getFullYear()} ${STORE.NAME} - All rights reserved</p>
        </div>
      </div>
    `;

    // Send order cancellation notification email to customer
    await transporter.sendMail({
      from: EMAIL.FROM,
      to: order.email,
      replyTo: EMAIL.REPLY_TO,
      subject: `Your ${STORE.NAME} Order Has Been Canceled - ${STORE.ORDER_PREFIX}${order?.display_id}`,
      html: cancellationHtml,
      // Add text version for better deliverability
      text: `
Your ${STORE.NAME} Order Has Been Canceled

Hello ${customerName},

We're writing to inform you that your order has been canceled.

Cancellation Information:
- Reason: ${cancellationReason}
- Canceled On: ${new Date(order?.canceled_at || order?.updated_at).toLocaleDateString()}

Order Information:
- Order Number: ${STORE.ORDER_PREFIX}${order?.display_id}
- Order Date: ${new Date(order?.created_at).toLocaleDateString()}

Order Items:
${order.items?.map(item => {
  const title = item?.title || item?.product_title || 'Product';
  const quantity = getNumber(item?.quantity || 0);
  const unitPrice = getNumber(item?.unit_price || 0);
  const total = (quantity * unitPrice);
  return `- ${title} (Qty: ${quantity}) - $${total.toFixed(2)}`;
}).join('\n') || 'No items'}

Order Summary:
- Subtotal: $${(getNumber(order.subtotal)).toFixed(2)}
- Shipping: $${(getNumber(order.shipping_total) ).toFixed(2)}
- Tax: $${(getNumber(order.tax_total) ).toFixed(2)}
${getNumber(order.discount_total) > 0 ? `- Discount: -$${(getNumber(order.discount_total)).toFixed(2)}\n` : ''}
- Total: $${getNumber((order.subtotal) ).toFixed(2)}

If you have any questions about this cancellation, please don't hesitate to contact our customer service team at ${STORE.SUPPORT_EMAIL}.

If you believe this cancellation was made in error, please contact us as soon as possible.

Thank you for your understanding.
${STORE.COMPANY_ADDRESS}
© ${new Date().getFullYear()} ${STORE.NAME} - All rights reserved
      `,
      headers: {
        'X-Entity-Ref-ID': `order-cancel-${data.id}-${Date.now()}`, // Prevent duplicate emails
      }
    });

    // Calculate execution time for logging if needed
    // const executionTime = Date.now() - startTime;

    // Always send a copy to admin for cancellations
    await transporter.sendMail({
      from: EMAIL.FROM,
      to: EMAIL.ADMIN,
      subject: `[ADMIN] Order Cancellation - ${STORE.ORDER_PREFIX}${order?.display_id}`,
      html: cancellationHtml,
      headers: {
        'X-Entity-Ref-ID': `order-cancel-admin-${data.id}-${Date.now()}`, // Prevent duplicate emails
      }
    });
    logger.info(`Admin copy of order cancellation notification sent for order ${order.id}`);

  } catch (error) {
    logger.error(`Failed to send order cancellation notification email for order ${data.id}:`, error);

    // Attempt to send error notification to admin
    try {
      await transporter.sendMail({
        from: EMAIL.FROM,
        to: EMAIL.ADMIN,
        subject: `[ERROR] Failed to send order cancellation notification for order ${data.id}`,
        text: `An error occurred while sending order cancellation notification email:

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
  event: "order.canceled",
}
function getNumber(value: any): number {
  if (value && typeof value === 'object' && 'numeric_' in value) {
    return value.numeric_; // Medusa BigNumber format
  } else if (typeof value === 'object' && typeof value.toNumber === 'function') {
    return value.toNumber(); // Standard BigNumber.js or ethers.js
  } else {
    return Number(value); // Plain number
  }
}
