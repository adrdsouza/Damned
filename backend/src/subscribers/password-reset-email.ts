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
  resetBox: "background-color: #f0f7ff; padding: 15px; border-radius: 4px; margin: 20px 0; border: 1px solid #d0e0ff;",
  button: "background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;",
  warningText: "color: #ff6600; font-weight: bold;",
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
 * This subscriber handles sending password reset emails to users
 * when they request to reset their password.
 * It listens for the auth.password_reset event.
 */
export default async function passwordResetEmailHandler({
  event: { data: {
    entity_id: email,
    token,
    actor_type,
  } },
  container,
}: SubscriberArgs<{ entity_id: string, token: string, actor_type: string }>) {
  // Get the email transporter
  const transporter = getEmailTransporter();

  // Start tracking execution time for performance monitoring
  const startTime = Date.now();

  try {
    logger.info(`Processing password reset email for ${email} (${actor_type})`);

    // Determine if this is a customer or admin user
    const isCustomer = actor_type === "customer";

    // Set the appropriate reset URL based on user type
    const urlPrefix = isCustomer ?
      process.env.STORE_URL || STORE.URL :
      process.env.ADMIN_URL || STORE.ADMIN_URL;

    const resetUrl = `${urlPrefix}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

    // Set expiration time (typically 1 hour from now)
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);

    // Create password reset email HTML
    const resetHtml = `
      <div style="${STYLES.container}">
        <div style="${STYLES.header}">
          <img src="${STORE.LOGO_URL}" alt="${STORE.NAME}" style="${STYLES.logo}">
          <h1 style="${STYLES.title}">Password Reset Request</h1>
        </div>

        <div style="${STYLES.content}">
          <p>Hello,</p>
          <p>We received a request to reset your password for your ${STORE.NAME} account. If you didn't make this request, you can safely ignore this email.</p>

          <div style="${STYLES.resetBox}">
            <h2 style="${STYLES.title}">Reset Your Password</h2>
            <p>To reset your password, click the button below:</p>

            <div style="text-align: center; margin: 25px 0;">
              <a href="${resetUrl}" style="${STYLES.button}">
                Reset Password
              </a>
            </div>

            <p>Or copy and paste this URL into your browser:</p>
            <p style="word-break: break-all;"><a href="${resetUrl}" style="${STYLES.link}">${resetUrl}</a></p>

            <p style="${STYLES.warningText}">This link will expire in 1 hour (at ${expirationTime.toLocaleTimeString()} on ${expirationTime.toLocaleDateString()}).</p>
          </div>

          <p>If you didn't request a password reset, please contact our support team at ${STORE.SUPPORT_EMAIL} immediately.</p>

          <p>For security reasons, this link can only be used once. If you need to reset your password again, please request a new link.</p>
        </div>

        <div style="${STYLES.footer}">
          <p>This is an automated message from ${STORE.NAME}. Please do not reply to this email.</p>
          <p>${STORE.COMPANY_ADDRESS}</p>
          <p>© ${new Date().getFullYear()} ${STORE.NAME} - All rights reserved</p>
        </div>
      </div>
    `;

    // Send password reset email
    const info = await transporter.sendMail({
      from: EMAIL.FROM,
      to: email,
      replyTo: EMAIL.REPLY_TO,
      subject: `${STORE.NAME} - Password Reset Request`,
      html: resetHtml,
      // Add text version for better deliverability
      text: `
Password Reset Request - ${STORE.NAME}

Hello,

We received a request to reset your password for your ${STORE.NAME} account. If you didn't make this request, you can safely ignore this email.

To reset your password, please visit the following link:
${resetUrl}

This link will expire in 1 hour (at ${expirationTime.toLocaleTimeString()} on ${expirationTime.toLocaleDateString()}).

If you didn't request a password reset, please contact our support team at ${STORE.SUPPORT_EMAIL} immediately.

For security reasons, this link can only be used once. If you need to reset your password again, please request a new link.

This is an automated message from ${STORE.NAME}. Please do not reply to this email.

${STORE.COMPANY_ADDRESS}
© ${new Date().getFullYear()} ${STORE.NAME} - All rights reserved
      `,
      headers: {
        'X-Entity-Ref-ID': `password-reset-${email}-${Date.now()}`, // Prevent duplicate emails
      }
    });

    const executionTime = Date.now() - startTime;
    logger.info(`Password reset email sent to ${email} (${actor_type}) (MessageID: ${info.messageId}, Time: ${executionTime}ms)`);

    // Send a notification to admin for monitoring (optional, can be disabled)
    if (process.env.NOTIFY_ADMIN_ON_PASSWORD_RESET === 'true') {
      await transporter.sendMail({
        from: EMAIL.FROM,
        to: EMAIL.ADMIN,
        subject: `[ADMIN] Password Reset Requested - ${email} (${actor_type})`,
        text: `
A password reset was requested for:

Email: ${email}
User Type: ${actor_type}
Time: ${new Date().toLocaleString()}

No action is required. This is just for monitoring purposes.
        `,
        headers: {
          'X-Entity-Ref-ID': `password-reset-admin-${email}-${Date.now()}`, // Prevent duplicate emails
        }
      });
      logger.info(`Admin notification sent for password reset request by ${email} (${actor_type})`);
    }

  } catch (error) {
    logger.error(`Failed to send password reset email to ${email}:`, error);

    // Attempt to send error notification to admin
    try {
      await transporter.sendMail({
        from: EMAIL.FROM,
        to: EMAIL.ADMIN,
        subject: `[ERROR] Failed to send password reset email to ${email}`,
        text: `An error occurred while sending password reset email:

Email: ${email}
User Type: ${actor_type}

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
  event: "auth.password_reset",
}
