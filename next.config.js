/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    dangerouslyAllowSVG: true,
    formats: ['image/avif', 'image/webp'],
    domains: ['admin.damneddesigns.com'],
    minimumCacheTTL: 60,
    disableStaticImages: true,
  },
  env: {
    GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
    FRONTEND_URL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    SITE_NAME: process.env.SITE_NAME,
    SESSION_TOKEN_LS_KEY: process.env.SESSION_TOKEN_LS_KEY,
    REFRESH_TOKEN_LS_KEY: process.env.REFRESH_TOKEN_LS_KEY,
    AUTH_TOKEN_SS_KEY: process.env.AUTH_TOKEN_SS_KEY,
    AUTH_FETCH_INTERVAL: process.env.AUTH_FETCH_INTERVAL,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    CREATE_ORDER_PASSWORD: process.env.CREATE_ORDER_PASSWORD,
    APP_ENV: process.env.APP_ENV,
  },
};

module.exports = nextConfig;
