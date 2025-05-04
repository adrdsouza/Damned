import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import nodemailer from "nodemailer"

// Store constants
const STORE = {
  NAME: process.env.STORE_NAME || "Damned Designs",
  URL: process.env.STORE_URL || "https://damneddesigns.com",
  ADMIN_URL: process.env.ADMIN_URL || "https://admin.damneddesigns.com",
  LOGO_URL: process.env.STORE_LOGO || "https://damneddesigns.com/Logo.svg",
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || "info@damneddesigns.com"
}

// Email constants
const EMAIL = {
  USER: process.env.SMTP_USERNAME || process.env.EMAIL_USER || "info@damneddesigns.com",
  FROM: process.env.SMTP_FROM || process.env.EMAIL_FROM || "info@damneddesigns.com",
  ADMIN: process.env.EMAIL_ADMIN || "info@damneddesigns.com"
}

/**
 * This subscriber handles sending welcome emails to users when they register.
 * It listens for the customer.created event.
 */
export default async function userRegistrationEmailHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  // Create a transporter using Gmail with OAuth2
  const transporter = nodemailer.createTransport({
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
  })

  try {
    const query = container.resolve("query")

    // Get customer data
    const { data: customerData } = await query.graph({
      entity: "customer",
      filters: { id: data.id },
      fields: [
        "id",
        "email",
        "first_name",
        "last_name",
        "created_at",
      ],
    })

    const customer = customerData[0]

    if (!customer?.email) {
      console.log("No email found for customer, skipping welcome email")
      return
    }

    // Create welcome email HTML
    const welcomeHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${STORE.LOGO_URL}" alt="${STORE.NAME}" style="max-width: 200px; height: auto;">
          <h1 style="color: #333;">Welcome to ${STORE.NAME}!</h1>
        </div>

        <div style="padding: 20px 0;">
          <p>Hello ${customer.first_name || 'there'},</p>
          <p>Thank you for creating an account with ${STORE.NAME}. We're excited to have you join our community!</p>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Your Account Information:</h2>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Name:</strong> ${customer.first_name || ''} ${customer.last_name || ''}</p>
            <p><strong>Date Joined:</strong> ${new Date(customer.created_at).toLocaleDateString()}</p>
          </div>

          <p>With your account, you can:</p>
          <ul style="padding-left: 20px; line-height: 1.6;">
            <li>Track your orders</li>
            <li>View your order history</li>
            <li>Update your profile information</li>
            <li>Save your shipping addresses</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${STORE.URL}/account" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Visit Your Account
            </a>
          </div>

          <p>If you have any questions or need assistance, please don't hesitate to contact our customer service team at ${STORE.SUPPORT_EMAIL}.</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #666;">
          <p>Thank you for choosing ${STORE.NAME}!</p>
          <p>© ${new Date().getFullYear()} ${STORE.NAME} - All rights reserved</p>
        </div>
      </div>
    `

    // Send welcome email to customer
    await transporter.sendMail({
      from: EMAIL.FROM,
      to: customer.email,
      subject: `Welcome to ${STORE.NAME}!`,
      html: welcomeHtml,
    })
    console.log(`Welcome email sent to ${customer.email}`)

    // Send notification to admin (optional)
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${STORE.LOGO_URL}" alt="${STORE.NAME}" style="max-width: 200px; height: auto;">
          <h1 style="color: #333;">New Customer Registration</h1>
        </div>

        <div style="padding: 20px 0;">
          <p style="background-color: #f0f7ff; color: #0066cc; padding: 10px; border-radius: 4px; text-align: center; margin-bottom: 20px; font-size: 16px;">
            <strong>📣 ADMIN NOTIFICATION: New customer has registered</strong>
          </p>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Customer Information:</h2>
            <p><strong>Customer ID:</strong> ${customer.id}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Name:</strong> ${customer.first_name || ''} ${customer.last_name || ''}</p>
            <p><strong>Date Registered:</strong> ${new Date(customer.created_at).toLocaleDateString()}</p>
            <p><strong>Admin URL:</strong> <a href="${STORE.ADMIN_URL}/customers/${customer.id}">View in Admin Panel</a></p>
          </div>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #666;">
          <p>This is an automated notification from your ${STORE.NAME} e-commerce system.</p>
          <p>© ${new Date().getFullYear()} ${STORE.NAME} - All rights reserved</p>
        </div>
      </div>
    `

    // Send notification to admin
    await transporter.sendMail({
      from: EMAIL.FROM,
      to: EMAIL.ADMIN,
      subject: `[ADMIN] New Customer Registration - ${customer.email}`,
      html: adminHtml,
    })
    console.log(`Admin notification sent for new customer ${customer.email}`)

  } catch (error) {
    console.error(`Failed to send registration email:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "customer.created",
}
