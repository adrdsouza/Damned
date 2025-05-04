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
  USER: process.env.EMAIL_USER || "info@damneddesigns.com",
  PASS: process.env.EMAIL_PASS || "epmq fknl jdwh wtkr",
  FROM: process.env.EMAIL_FROM || "info@damneddesigns.com",
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
  refundBox: "background-color: #f0fff0; padding: 15px; border-radius: 4px; margin: 20px 0; border: 1px solid #ccffcc;",
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
      service: "gmail",
      auth: {
        user: EMAIL.USER,
        pass: EMAIL.PASS,
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
 * This subscriber handles sending order refund notification emails to customers
 * when their order has been refunded (partially or fully).
 * It listens for the order.refund_created event.
 */
export default async function orderRefundEmailHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string, refund_id: string }>) {
  // Get the email transporter
  const transporter = getEmailTransporter();

  // Start tracking execution time for performance monitoring
  const startTime = Date.now();

  try {
    logger.info(`Processing order refund notification for order ${data.id}, refund ${data.refund_id}`);

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
        "refunds.*",
        "payments.*",
        "metadata"
      ],
    });

    const order = orderData[0];
console.log(order,"ordfgsdfgsfgsdfgsdfger");
    // Validate order data
    if (!order) {
      logger.warn(`No order found with ID ${data.id}, skipping refund notification`);
      return;
    }

    // Validate customer email
    if (!order.email) {
      logger.warn(`No email found for order ${order.id}, skipping refund notification`);
      return;
    }

    // Get the specific refund
    const refund = order.refunds?.find(r => r.id === data.refund_id);
    
    if (!refund) {
      logger.warn(`No refund found with ID ${data.refund_id} for order ${data.id}, skipping refund notification`);
      return;
    }

    // Get refund reason if available
    const refundReason = refund.reason || order.metadata?.refund_reason || "Your order has been refunded.";
    
    // Calculate total refunded amount (including this refund)
    const totalRefundedAmount = order.refunds?.reduce((sum, r) => sum + (r.amount || 0), 0) || 0;
    
    // Determine if this is a full or partial refund
    const isFullRefund = totalRefundedAmount >= order.total;
    const refundType = isFullRefund ? "Full Refund" : "Partial Refund";

    // Format order items
    const orderItems = order.items?.map(item => {
      const title = item?.title || item?.product_title || "Product";
      const quantity = item?.quantity || 0;
      const unitPrice = item?.unit_price || 0;
      const total = (quantity * unitPrice) / 100; // Convert from cents to dollars
      
      return `<tr>
        <td style="${STYLES.tableCell}">${title}</td>
        <td style="${STYLES.tableCellCenter}">${quantity}</td>
        <td style="${STYLES.tableCellCenter}">$${(unitPrice / 100).toFixed(2)}</td>
        <td style="${STYLES.tableCellCenter}">$${total.toFixed(2)}</td>
      </tr>`;
    }).join("") || "";

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

    // Create order refund notification email HTML
    const refundHtml = `
      <div style="${STYLES.container}">
        <div style="${STYLES.header}">
          <img src="${STORE.LOGO_URL}" alt="${STORE.NAME}" style="${STYLES.logo}">
          <h1 style="${STYLES.title}">Your Order Has Been Refunded</h1>
        </div>

        <div style="${STYLES.content}">
          <p>Hello ${customerName},</p>
          <p>We're writing to inform you that a refund has been processed for your order.</p>

          <div style="${STYLES.refundBox}">
            <h2 style="${STYLES.title}">Refund Information:</h2>
            <p><strong>Refund Type:</strong> ${refundType}</p>
            <p><strong>Refund Amount:</strong> $${(refund.amount / 100).toFixed(2)}</p>
            <p><strong>Refund Date:</strong> ${new Date(refund.created_at).toLocaleDateString()}</p>
            <p><strong>Reason:</strong> ${refundReason}</p>
            ${refund.note ? `<p><strong>Note:</strong> ${refund.note}</p>` : ''}
          </div>

          <div style="${STYLES.infoBox}">
            <h2 style="${STYLES.title}">Order Information:</h2>
            <p><strong>Order Number:</strong> ${STORE.ORDER_PREFIX}${order?.display_id}</p>
            <p><strong>Order Date:</strong> ${new Date(order?.created_at).toLocaleDateString()}</p>
            <p><strong>Total Order Amount:</strong> $${(order.total / 100).toFixed(2)}</p>
            <p><strong>Total Refunded Amount:</strong> $${(totalRefundedAmount / 100).toFixed(2)}</p>
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
            <p><strong>Subtotal:</strong> $${(order.subtotal / 100).toFixed(2)}</p>
            <p><strong>Shipping:</strong> $${(order.shipping_total / 100).toFixed(2)}</p>
            <p><strong>Tax:</strong> $${(order.tax_total / 100).toFixed(2)}</p>
            ${order.discount_total > 0 ? `<p><strong>Discount:</strong> -$${(order.discount_total / 100).toFixed(2)}</p>` : ''}
            <p style="font-size: 18px; margin-top: 10px; border-top: 2px solid #ddd; padding-top: 10px;">
              <strong>Total:</strong> $${(order.total / 100).toFixed(2)}
            </p>
            <p style="color: #4CAF50; font-weight: bold;">
              <strong>Refunded:</strong> $${(totalRefundedAmount / 100).toFixed(2)}
            </p>
          </div>

          <p>The refund has been processed and should appear on your original payment method within 3-10 business days, depending on your bank or credit card issuer.</p>
          
          <p>If you have any questions about this refund, please don't hesitate to contact our customer service team at ${STORE.SUPPORT_EMAIL}.</p>
        </div>

        <div style="${STYLES.footer}">
          <p>Thank you for your understanding.</p>
          <p>${STORE.COMPANY_ADDRESS}</p>
          <p>© ${new Date().getFullYear()} ${STORE.NAME} - All rights reserved</p>
        </div>
      </div>
    `;

    // Send order refund notification email to customer
    const info = await transporter.sendMail({
      from: EMAIL.FROM,
      to: order.email,
      replyTo: EMAIL.REPLY_TO,
      subject: `Your ${STORE.NAME} Order Has Been Refunded - ${STORE.ORDER_PREFIX}${order?.display_id}`,
      html: refundHtml,
      // Add text version for better deliverability
      text: `
Your ${STORE.NAME} Order Has Been Refunded

Hello ${customerName},

We're writing to inform you that a refund has been processed for your order.

Refund Information:
- Refund Type: ${refundType}
- Refund Amount: $${(refund.amount / 100).toFixed(2)}
- Refund Date: ${new Date(refund.created_at).toLocaleDateString()}
- Reason: ${refundReason}
${refund.note ? `- Note: ${refund.note}\n` : ''}

Order Information:
- Order Number: ${STORE.ORDER_PREFIX}${order?.display_id}
- Order Date: ${new Date(order?.created_at).toLocaleDateString()}
- Total Order Amount: $${(order.total / 100).toFixed(2)}
- Total Refunded Amount: $${(totalRefundedAmount / 100).toFixed(2)}

Order Items:
${order.items?.map(item => {
  const title = item?.title || item?.product_title || 'Product';
  const quantity = item?.quantity || 0;
  const unitPrice = item?.unit_price || 0;
  const total = (quantity * unitPrice) / 100;
  return `- ${title} (Qty: ${quantity}) - $${total.toFixed(2)}`;
}).join('\n') || 'No items'}

Order Summary:
- Subtotal: $${(order.subtotal / 100).toFixed(2)}
- Shipping: $${(order.shipping_total / 100).toFixed(2)}
- Tax: $${(order.tax_total / 100).toFixed(2)}
${order.discount_total > 0 ? `- Discount: -$${(order.discount_total / 100).toFixed(2)}\n` : ''}
- Total: $${(order.total / 100).toFixed(2)}
- Refunded: $${(totalRefundedAmount / 100).toFixed(2)}

The refund has been processed and should appear on your original payment method within 3-10 business days, depending on your bank or credit card issuer.

If you have any questions about this refund, please don't hesitate to contact our customer service team at ${STORE.SUPPORT_EMAIL}.

Thank you for your understanding.
${STORE.COMPANY_ADDRESS}
© ${new Date().getFullYear()} ${STORE.NAME} - All rights reserved
      `,
      headers: {
        'X-Entity-Ref-ID': `order-refund-${data.id}-${data.refund_id}`, // Prevent duplicate emails
      }
    });

    const executionTime = Date.now() - startTime;
    logger.info(`Order refund notification email sent to ${order.email} for order ${order.id}, refund ${data.refund_id} (MessageID: ${info.messageId}, Time: ${executionTime}ms)`);

    // Always send a copy to admin for refunds
    await transporter.sendMail({
      from: EMAIL.FROM,
      to: EMAIL.ADMIN,
      subject: `[ADMIN] Order Refund - ${STORE.ORDER_PREFIX}${order?.display_id} ($${(refund.amount / 100).toFixed(2)})`,
      html: refundHtml,
      headers: {
        'X-Entity-Ref-ID': `order-refund-admin-${data.id}-${data.refund_id}`, // Prevent duplicate emails
      }
    });
    logger.info(`Admin copy of order refund notification sent for order ${order.id}, refund ${data.refund_id}`);

  } catch (error) {
    logger.error(`Failed to send order refund notification email for order ${data.id}, refund ${data.refund_id}:`, error);

    // Attempt to send error notification to admin
    try {
      await transporter.sendMail({
        from: EMAIL.FROM,
        to: EMAIL.ADMIN,
        subject: `[ERROR] Failed to send order refund notification for order ${data.id}`,
        text: `An error occurred while sending order refund notification email:

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
  event: "order.refund_created",
}
