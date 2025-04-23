import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Define the NMI plugin configuration
const nmiPaymentPlugin = {
  resolve: "medusa-payment-nmi",
  options: {
    security_key: process.env.NMI_SECURITY_KEY,
    // webhook_endpoint: "/nmi/hooks/nmi", // The webhook path is defined in the plugin's index.js router
    capture_on_completion: true // Or false based on preference
  }
};

// Define the Sezzle plugin configuration
const sezzlePaymentPlugin = {
  resolve: "medusa-payment-sezzle",
  options: {
    public_key: process.env.SEZZLE_PUBLIC_KEY,
    private_key: process.env.SEZZLE_PRIVATE_KEY,
    webhook_secret: process.env.SEZZLE_WEBHOOK_SECRET,
    sandbox_mode: process.env.SEZZLE_SANDBOX_MODE,
    capture_mode: process.env.SEZZLE_CAPTURE_MODE || "manual" // Can be "automatic" or "manual"
  }
};

// Define the Cash on Delivery plugin configuration
const codPaymentPlugin = {
  resolve: "medusa-payment-cod",
  options: {}
};

// Ensure CORS settings include all necessary domains
const cors = {
  origin: [
    "http://localhost:8000",
    "https://docs.medusajs.com",
    "https://damneddesigns.com",
    "https://api.damneddesigns.com",
    "https://admin.damneddesigns.com"
  ],
  credentials: true,
};

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
    },
    cors,
  },
  modules:[
    {
      resolve: "@medusajs/cache-redis",
      key: "cache",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/event-bus-redis",
      key: "event_bus",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
            options: {
              backend_url: process.env.SERVER_LINK || "http://localhost:9000",
              upload_dir: "uploads",
            },
          },
        ],
      },
    }
  ],
  plugins: [
    // Add the payment plugin configurations here
    nmiPaymentPlugin,
    sezzlePaymentPlugin,
    codPaymentPlugin,
    // Add Nodemailer with Google OAuth 2.0 for email notifications
    {
      resolve: `medusa-plugin-nodemailer`,
      options: {
        from: process.env.SMTP_FROM,
        transport: {
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // use SSL
          auth: {
            type: "OAuth2",
            user: process.env.SMTP_USERNAME, // your Google email
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: process.env.GOOGLE_ACCESS_TOKEN, // Optional
            expires: process.env.GOOGLE_TOKEN_EXPIRES // Optional
          },
        },
      },
    }
  ]
})
