import { loadEnv, defineConfig } from '@medusajs/framework/utils';
import path from "path"; // Import path module

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    disable: true,
  },
  plugins: [
    {
      resolve: `medusa-plugin-nodemailer`,
      options: {
        from: process.env.SMTP_FROM,
        order_placed_template: "orderplaced",
        order_shipment_created_template: "ordershipped",
        order_canceled_template: "ordercanceled",
        order_updated_template: "orderupdated",
        order_refund_created_template: "orderrefunded",
        customer_password_reset_template: "passwordreset",
        enable_order_placed_emails: true,
        enable_order_shipment_created_emails: true,
        enable_order_canceled_emails: true,
        enable_order_updated_emails: true,
        enable_order_refund_created_emails: true,
        enable_customer_password_reset_emails: true,
        bcc: process.env.SMTP_USERNAME, // BCC admin on customer emails
        transport: {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            type: "OAuth2",
            user: process.env.SMTP_USERNAME,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: process.env.GOOGLE_ACCESS_TOKEN, // Optional - generated from refresh token
            expires: process.env.GOOGLE_TOKEN_EXPIRES // Optional - expiration time
          },
          logger: true, // Enable logging for debugging
          debug: true // Enhanced debugging information
        }
      }
    },
    {
      resolve: "@medusajs/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
        ttl: 30, // Keep events for 30 seconds
      },
    },
    {
      resolve: "@medusajs/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
        ttl: 30, // Cache for 30 seconds
        invalidation: {
          resources: ["product", "product-variant"],
          triggers: ["product.updated", "product-variant.updated"]
        }
      },
    },
    {
      resolve: `medusa-payment-nmi`,
      options: {
        security_key: process.env.NMI_SECURITY_KEY,
        api_mode: process.env.NODE_ENV === "production" ? "live" : "test"
      }
    },
    {
      resolve: `medusa-payment-sezzle`,
      options: {
        public_key: process.env.SEZZLE_PUBLIC_KEY,
        private_key: process.env.SEZZLE_PRIVATE_KEY,
        sandbox: process.env.SEZZLE_SANDBOX_MODE === "true",
        capture_mode: process.env.SEZZLE_CAPTURE_MODE || "automatic"
      }
    },
    // Note: No file service module needed as per imagesetup.md
    // Using Medusa's system default manual payment provider - no need to specify
  ]
})
