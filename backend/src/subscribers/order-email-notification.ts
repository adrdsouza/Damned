import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import nodemailer from "nodemailer"

// Store constants
const STORE = {
  NAME: process.env.STORE_NAME || "Damned Designs",
  URL: process.env.STORE_URL || "https://damneddesigns.com",
  ADMIN_URL: process.env.ADMIN_URL || "https://admin.damneddesigns.com",
  LOGO_URL: process.env.STORE_LOGO || "https://damneddesigns.com/Logo.svg",
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || "support@damneddesigns.com",
  ORDER_PREFIX: "DD" // Prefix for order numbers
}

// Email constants
const EMAIL = {
  USER: process.env.EMAIL_USER || "alishanwd1@gmail.com",
  PASS: process.env.EMAIL_PASS || "epmq fknl jdwh wtkr",
  FROM: process.env.EMAIL_FROM || "alishanwd1@gmail.com",
  ADMIN: process.env.EMAIL_ADMIN || "alishanwd1@gmail.com"
}

/**
 * This subscriber handles sending order confirmation emails to both the customer and admin
 * when an order is placed. It uses Gmail with app password for sending emails.
 */
export default async function orderPlacedEmailHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {

  // Create a transporter using Gmail with app password
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL.USER,
      pass: EMAIL.PASS,
    },
  })

  try {
    const query = container.resolve("query")

    // Then use query to get related data
    const { data: orderData } = await query.graph({
      entity: "order",
      filters: { id: data.id },
      fields: [
        "id",
        "email",
        "display_id",
        "created_at",
        "customer.*",
        "billing_address.*",
        "shipping_address.*",
        "items.*",
        "subtotal",
      "shipping_total",
      "tax_total",
      "total",
      "discount_total"
      ],
    })
    let orderWithRelations=orderData[0]
  console.log(orderWithRelations,"orderWithRelatioasdns");
  const subtotal = orderWithRelations?.subtotal?.numeric_ ?? 0;
const shippingTotal = orderWithRelations?.shipping_total?.numeric_ ?? 0;
const taxTotal = orderWithRelations?.tax_total?.numeric_ ?? 0;
const total = orderWithRelations?.total?.numeric_ ?? 0;
const discountTotal = orderWithRelations?.discount_total?.numeric_ ?? 0;


    // Format order items for display in email
    const items = orderWithRelations?.items?.map(item => {
      const title = item?.product_title || item?.title || "Product";
      const price = getNumber(item?.unit_price??0 ).toFixed(2);
      return `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${getNumber(item?.quantity)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${price}</td>
      </tr>`;
    }).join("");

    // Format shipping address if available
    let shippingAddressHtml = "";
    if (orderWithRelations?.shipping_address) {
      const addr = orderWithRelations?.shipping_address;
      shippingAddressHtml = `
        <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
          <h2 style="color: #333; margin-top: 0;">Shipping Information:</h2>
          <p>${addr.first_name} ${addr.last_name}</p>
          <p>${addr.address_1}</p>
          ${addr.address_2 ? `<p>${addr.address_2}</p>` : ''}
          <p>${addr.city}, ${addr.province} ${addr.postal_code}</p>
          <p>${addr.country_code}</p>
        </div>
      `;
    }

    // Create customer email HTML
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${STORE.LOGO_URL}" alt="${STORE.NAME}" style="max-width: 200px; height: auto;">
          <h1 style="color: #333;">Thank you for your order!</h1>
        </div>

        <div style="padding: 20px 0;">
          <p>Hello ${orderWithRelations?.email},</p>
          <p>Thank you for your purchase with ${STORE.NAME}. Your order has been received and is being processed.</p>

          <h2 style="color: #333;">Order Details:</h2>
          <p><strong>Order Number:</strong> ${STORE.ORDER_PREFIX}${orderWithRelations?.display_id}</p>
          <p><strong>Date:</strong> ${new Date(orderWithRelations.created_at).toLocaleDateString()}</p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Quantity</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${items}
            </tbody>
          </table>

          <div style="margin: 20px 0; text-align: right;">
            <p><strong>Subtotal:</strong> $${(subtotal).toFixed(2)}</p>
            <p><strong>Shipping:</strong> $${(shippingTotal).toFixed(2)}</p>
            <p><strong>Tax:</strong> $${(taxTotal ).toFixed(2)}</p>
            <p style="font-size: 18px; margin-top: 10px; border-top: 2px solid #ddd; padding-top: 10px;">
              <strong>Total:</strong> $${(total).toFixed(2)}
            </p>
          </div>

          ${shippingAddressHtml}
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #666;">
          <p>If you have any questions about your order, please contact our customer service team at ${STORE.SUPPORT_EMAIL}.</p>
          <p>Thank you for shopping with ${STORE.NAME}!</p>
        </div>
      </div>
    `;

    // Create admin email HTML
    const addr = orderWithRelations?.shipping_address;
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${STORE.LOGO_URL}" alt="${STORE.NAME}" style="max-width: 200px; height: auto;">
          <h1 style="color: #333;">New Order Received!</h1>
        </div>

        <div style="padding: 20px 0;">
          <p style="background-color: #ffe9e9; color: #d32f2f; padding: 10px; border-radius: 4px; text-align: center; margin-bottom: 20px; font-size: 16px;">
            <strong>⚠️ ADMIN NOTIFICATION: New order has been received</strong>
          </p>

          <p><strong>Customer:</strong> ${orderWithRelations?.customer ? `${orderWithRelations?.customer?.first_name ?? addr?.first_name} ${orderWithRelations?.customer?.last_name ??  addr?.last_name}` : ''} (${orderWithRelations?.email})</p>

          <h2 style="color: #333;">Order Details:</h2>
          <p><strong>Order Number:</strong> ${STORE.ORDER_PREFIX}${orderWithRelations?.display_id}</p>
          <p><strong>Date:</strong> ${new Date(orderWithRelations?.created_at).toLocaleDateString()}</p>
          <p><strong>Order URL:</strong> <a href="${STORE.ADMIN_URL}/orders/${orderWithRelations?.id}">View in Admin Panel</a></p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Quantity</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${items}
            </tbody>
          </table>

          <div style="margin: 20px 0; text-align: right;">
            <p><strong>Subtotal:</strong> $${(subtotal ).toFixed(2)}</p>
            <p><strong>Shipping:</strong> $${(shippingTotal).toFixed(2)}</p>
            <p><strong>Tax:</strong> $${(taxTotal ).toFixed(2)}</p>
            <p style="font-size: 18px; margin-top: 10px; border-top: 2px solid #ddd; padding-top: 10px;">
              <strong>Total:</strong> $${(total).toFixed(2)}
            </p>
          </div>

          ${shippingAddressHtml}
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #666;">
          <p>This is an automated notification from your ${STORE.NAME} e-commerce system.</p>
          <p>© ${new Date().getFullYear()} ${STORE.NAME} - All rights reserved</p>
        </div>
      </div>
    `;

    if(!orderWithRelations?.email){
      return
    }
    // Send email to customer
    await transporter.sendMail({
      from: EMAIL.FROM,
      to: orderWithRelations?.email,
      subject: `${STORE.NAME} - Order Confirmation ${STORE.ORDER_PREFIX}${orderWithRelations?.display_id}`,
      html: customerHtml,
    })
    console.log(`Customer email sent for order ${data.id}`)

    // Send email to admin
    await transporter.sendMail({
      from: EMAIL.FROM,
      to: EMAIL.ADMIN, // Send to admin email
      subject: `[ADMIN] New Order ${STORE.ORDER_PREFIX}${orderWithRelations?.display_id}`,
      html: adminHtml,
    })
    console.log(`Admin email sent for order ${data.id}`)

  } catch (error) {
    console.error(`Failed to send email for order ${data.id}:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
function getNumber(value) {
  if (value && typeof value === 'object' && 'numeric_' in value) {
    return value.numeric_; // Medusa BigNumber format
  } else if (typeof value === 'object' && typeof value.toNumber === 'function') {
    return value.toNumber(); // Standard BigNumber.js or ethers.js
  } else {
    return Number(value); // Plain number
  }
}
