import { loadEnv, defineConfig } from '@medusajs/framework/utils'

// Add NodeJS types explicitly for process.env
declare const process: {
  env: {
    [key: string]: string | undefined
    NODE_ENV: string
    DATABASE_URL: string
    REDIS_URL: string
    STORE_CORS: string
    ADMIN_CORS: string
    AUTH_CORS: string
    JWT_SECRET?: string
    COOKIE_SECRET?: string
    SERVER_LINK?: string
    NMI_SECURITY_KEY?: string
    SEZZLE_PUBLIC_KEY?: string
    SEZZLE_PRIVATE_KEY?: string
    SEZZLE_WEBHOOK_SECRET?: string
    SEZZLE_SANDBOX_MODE?: string
    SEZZLE_CAPTURE_MODE?: string
    SMTP_FROM?: string
    SMTP_USERNAME?: string
    GOOGLE_CLIENT_ID?: string
    GOOGLE_CLIENT_SECRET?: string
    GOOGLE_REFRESH_TOKEN?: string
  }
  cwd(): string
}

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
  
    // Register custom entities for MikroORM (including LineItem with product_title)
  },
  modules:[
  
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
    },
    // ...do not add custom subscriber here, Medusa will auto-load from src/subscribers...
  ],
  plugins: [
    // Add the payment plugin configurations here
    nmiPaymentPlugin,
    sezzlePaymentPlugin,
   
  ]
})
