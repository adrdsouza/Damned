# Damned Designs System Overview

This document provides a comprehensive overview of the Damned Designs e-commerce system architecture, configuration, and key components.

## 1. System Architecture

### Overall Architecture

The system follows a modern e-commerce architecture with separate frontend, backend, and data layers:

- **Frontend Layer**:
  - Next.js Storefront (customer-facing website)
  - Admin Panel (React/Vite based internal management)

- **Backend Layer**:
  - Medusa.js Server (e-commerce engine)
  - Payment Services (NMI payment gateway)
  - Various modules (Product, Order, Customer, Inventory management)

- **Data Layer**:
  - PostgreSQL Database (persistent storage)
  - Redis Event Bus (event handling and caching)
  - Local File Storage (product images and assets)

- **External Services**:
  - Custom Image Server (image processing and serving)
  - NMI Payment Gateway (payment processing)
  - Gmail SMTP (email notifications)

### Technology Stack

#### Backend Components
- **Core**: Medusa.js v2.7.0
- **Runtime**: Node.js 20+
- **Database**: PostgreSQL with MikroORM
- **Event Bus**: Redis
- **File Storage**: Local file storage
- **API**: RESTful API endpoints
- **Payment**: Custom NMI payment integration
- **Email**: Nodemailer with Gmail OAuth2

#### Frontend Storefront
- **Framework**: Next.js 15
- **UI Library**: React 19 (RC)
- **Styling**: Tailwind CSS
- **State Management**: React Query via Medusa's SDK
- **Features**: Product pages, cart, checkout, user accounts

#### Admin Panel
- **Framework**: Vite with React 18
- **Language**: TypeScript
- **UI Components**: Medusa UI, Radix UI
- **State Management**: React Query (Tanstack Query)
- **Data Grid**: Tanstack Table
- **Internationalization**: i18next

#### Additional Services
- **Image Server**: Dedicated service for image handling
- **Process Manager**: PM2 for all Node.js services
- **Custom Payment**: NMI payment integration

## 2. Configuration Details

### Environment Variables

#### Backend (`.env`)
```
STORE_CORS=http://localhost:8000,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com,https://damneddesigns.com,https://admin.damneddesigns.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com,https://damneddesigns.com,https://admin.damneddesigns.com
REDIS_URL=redis://localhost:6379
JWT_SECRET=d9c01c57d4f64e8b9a36b3297a4cf6c2e98b1f4a5e7c3d2b
COOKIE_SECRET=e8f2a7d6c3b9e5f1a4d2c7b3e5f9a8d6c3b2e5f8a7d9c6
DATABASE_URL=postgres://myuser:adrdsouza@localhost/medusa-medusaapp
SERVER_LINK=https://api.damneddesigns.com
IMAGE_SERVER_URL=https://images.damneddesigns.com
NMI_SECURITY_KEY=h3WD8p6Hc8WM4eEAqpb6fsTJMYp45Mrp

# Nodemailer Gmail OAuth Configuration
SMTP_FROM=info@damneddesigns.com
SMTP_USERNAME=info@damneddesigns.com
```

#### Frontend (`.env`)
```
MEDUSA_BACKEND_URL=https://api.damneddesigns.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_37d4b273553c24414059314072f8423064879e3233e4022a85081d7703a5dfbf
NEXT_PUBLIC_BASE_URL=https://damneddesigns.com
NEXT_PUBLIC_DEFAULT_REGION=us
REVALIDATE_SECRET=supersecret
```

#### Image Server
```
PORT=6162
DOMAIN_URL=https://images.damneddesigns.com
UPLOAD_DIR=static
ALLOWED_ORIGINS=https://admin.damneddesigns.com,https://api.damneddesigns.com
```

### Key Configuration Files

- **Medusa Config**: `backend/medusa-config.ts`
- **PM2 Config**: `ecosystem.config.js` (manages all services)
- **NMI Config**: Payment gateway configuration in `.env` and plugin code

## 3. Payment Integrations

### NMI Payment Gateway

#### Overview
The NMI payment integration enables secure credit card processing through Network Merchants Inc payment gateway.

#### Configuration Details
- **Security Key**: `h3WD8p6Hc8WM4eEAqpb6fsTJMYp45Mrp`
- **Checkout Public Key**: `checkout_public_2he6c5yTBC73u3AV2reJeHb37TpEegUa`
- **API Endpoint**: `https://secure.nmi.com/api/transact.php`
- **Plugin Location**: `/packages/medusa-payment-nmi`
- **Database ID**: `pp_nmi_nmi`

#### Features
- ✅ Basic payment processing (authorization & capture)
- ✅ Payment status tracking
- ✅ Integration with Medusa checkout flow
- ⚠️ Refunding (needs verification)
- ⚠️ Webhook handling (needs verification)

#### Test Cards
- **Visa (Success)**: 4111111111111111
- **Visa (Decline)**: 4111111111111112
- **Mastercard (Success)**: 5431111111111111
- **Mastercard (Decline)**: 5431111111111112
- Use any future expiration date and any 3-4 digit CVV

### Sezzle Payment Gateway

#### Overview
The system is also configured for Sezzle "Buy Now, Pay Later" integration, allowing customers to split purchases into four interest-free payments over six weeks.

#### Configuration Details
- **Integration Type**: REST API Integration
- **Authentication**: API Keys (Public/Private Key pairs)
- **API Endpoint**: https://gateway.sezzle.com/v2 (production)
- **Plugin Location**: `/packages/medusa-payment-sezzle`
- **Database ID**: `pp_sezzle_sezzle`

#### Key Features
- ✅ Checkout integration with Sezzle "Buy Now, Pay Later"
- ✅ Payment status tracking
- ✅ Order creation and management
- ⚠️ Refunding and webhook handling need verification

#### Documentation
See the complete Sezzle integration documentation at `/documentation/sezzle-integration.md`

## 4. Email Integration (SMTP)

### Overview
The system uses Gmail SMTP with OAuth2 authentication for sending transactional emails to customers.

### Configuration Details
- **Provider**: Gmail SMTP with OAuth2
- **From Address**: info@damneddesigns.com
- **Plugin**: medusa-plugin-nodemailer
- **Authentication**: Google OAuth2

### Environment Variables
```
SMTP_FROM=info@damneddesigns.com
SMTP_USERNAME=info@damneddesigns.com
```

### Email Types
- Order confirmations
- Shipping updates
- Password resets
- Welcome emails
- Customer notifications

## 5. Process Management (PM2)

### Overview
PM2 is used to manage all Node.js processes, ensuring they run continuously and restart automatically in case of failures.

### Installation
```bash
npm install -g pm2
```

### PM2 Configuration
The main configuration file is located at `/root/damneddesigns/ecosystem.config.js`:

```js
// ecosystem.config.js snippet
module.exports = {
  apps: [
    {
      name: "damned-designs-backend",
      cwd: "/root/damneddesigns/backend/.medusa/server",
      script: "npm",
      args: "run start",
      env: { NODE_ENV: "production" },
      time: true,
      autorestart: true,
      max_restarts: 10,
      watch: false,
      instances: 1,
      exec_mode: "fork"
    },
    {
      name: "damned-designs-frontend",
      cwd: "/root/damneddesigns/frontend",
      script: "npm",
      args: "run start",
      env: { NODE_ENV: "production" },
      time: true,
      autorestart: true,
      max_restarts: 10,
      watch: false,
      instances: 1,
      exec_mode: "fork"
    },
    {
      name: "damned-designs-admin",
      cwd: "/root/damneddesigns/admin",
      script: "npm",
      args: "run preview",
      env: { NODE_ENV: "production" },
      time: true,
      autorestart: true,
      max_restarts: 10,
      watch: false,
      instances: 1,
      exec_mode: "fork"
    },
    {
      name: "damned-designs-imagesserver",
      cwd: "/root/damneddesigns/imagesserver/images",
      script: "node",
      args: "index.js",
      env: { NODE_ENV: "production" },
      time: true,
      autorestart: true,
      max_restarts: 10,
      watch: false,
      instances: 1,
      exec_mode: "fork"
    }
  ]
};
```

### PM2 Commands
- **Start all services**: `pm2 start ecosystem.config.js`
- **Restart specific service**: `pm2 restart damned-designs-backend`
- **Stop specific service**: `pm2 stop damned-designs-frontend`
- **Stop all services**: `pm2 stop all`
- **View logs**: `pm2 logs` or `pm2 logs damned-designs-backend`
- **Monitor resources**: `pm2 monit`
- **Save current process list**: `pm2 save`
- **Setup startup script**: `pm2 startup`
- **Restore saved processes**: `pm2 resurrect`

### Startup Configuration
PM2 is configured to start automatically on system boot with:
```bash
pm2 startup
pm2 save
```

### Process-Specific Scripts
- **Start Everything**: `/root/damneddesigns/start-pm2.sh`
- **Frontend Development**: `/root/damneddesigns/frontend-dev.sh`

## 6. System Management

### Server Environment
- **Operating System**: Linux
- **Node.js Version**: 20.x
- **Memory**: Minimum 2GB RAM recommended for production
- **Storage**: Minimum 20GB for media files and database

### Deployment Configuration
```js
// ecosystem.config.js snippet
module.exports = {
  apps: [
    {
      name: "damned-designs-backend",
      cwd: "/root/damneddesigns/backend/.medusa/server",
      script: "npm",
      args: "run start",
      env: { NODE_ENV: "production" }
    },
    {
      name: "damned-designs-frontend",
      cwd: "/root/damneddesigns/frontend",
      script: "npm",
      args: "run start",
      env: { NODE_ENV: "production" }
    },
    {
      name: "damned-designs-admin",
      cwd: "/root/damneddesigns/admin",
      script: "npm",
      args: "run preview",
      env: { NODE_ENV: "production" }
    },
    {
      name: "damned-designs-imagesserver",
      cwd: "/root/damneddesigns/imagesserver/images",
      script: "node",
      args: "index.js",
      env: { NODE_ENV: "production" }
    }
  ]
};
```

## 7. Deployment Checklist

### Backend Deployment
1. Ensure Node.js 20.x is installed
2. Set up all environment variables in production environment
3. Run database migrations: `medusa migrations run`
4. Use the automated build script: `./build-and-start.sh`
   - This script handles building the application, installing dependencies, copying environment variables, and starting the server
5. Alternatively, follow these manual steps:
   ```
   npm run build
   cd .medusa/server && npm install
   cp ../../.env .env.production
   export NODE_ENV=production
   npm run start
   ```
6. Verify API endpoints are accessible: `curl https://api.yourdomain.com/health`

### Frontend Deployment
1. Set correct environment variables for the production build
2. Build the Next.js frontend: `npm run build`
3. Start the frontend server: `npm run start`
4. Verify the site loads correctly and payment options appear
5. Test checkout flows with sandbox payment credentials

## 8. Key Features

### Backend Features
- Product management (creation, update, variants)
- Inventory management
- Order processing
- Customer management and authentication
- Pricing and tax calculation
- Discount handling
- NMI payment processing
- Shipping method management
- Returns and exchanges
- Multi-currency support
- Email notifications via Gmail SMTP

### Frontend Storefront Features
- Product browsing and filtering
- Product detail pages with variants
- Shopping cart functionality
- User authentication and accounts
- Checkout process with NMI payment
- Order history and tracking
- Mobile responsiveness (Tailwind CSS)
- Performance optimizations:
  - Server-side rendering
  - Static generation for product pages
  - App Router

### Admin Panel Features
- Dashboard with key metrics
- Product management interface
- Order management and processing
- Customer management
- Inventory management
- Discount creation
- Payment configuration
- Shipping method configuration
- User role management

## 9. Maintenance and Recovery

### Important Directories
- **Backend**: `/root/damneddesigns/backend`
- **Frontend**: `/root/damneddesigns/frontend`
- **Admin**: `/root/damneddesigns/admin`
- **Image Server**: `/root/damneddesigns/imagesserver/images`
- **NMI Plugin**: `/root/damneddesigns/packages/medusa-payment-nmi`

### Database Management
- **Connection**: PostgreSQL at `postgres://myuser:adrdsouza@localhost/medusa-medusaapp`
- **Admin Panel**: Access the database using pgAdmin or similar tools
- **Backup**: Schedule daily PostgreSQL dumps
  ```bash
  pg_dump -U myuser -d medusa-medusaapp > backup_$(date +%Y%m%d).sql
  ```

### Troubleshooting Steps
1. Check PM2 logs for errors: `pm2 logs`
2. Verify Redis is running: `redis-cli ping`
3. Check PostgreSQL connection: `psql -U myuser -d medusa-medusaapp`
4. Restart services as needed: `pm2 restart <service-name>`
5. Check email sending functionality: Test with a sample order

### Disaster Recovery
1. Stop the Medusa server
2. Restore the latest database backup:
   ```bash
   psql -U myuser -d medusa-medusaapp < backup_file.sql
   ```
3. Run migrations if needed: `medusa migrations run`
4. Restart the Medusa server
5. Verify all services are running: `pm2 list`

## 10. Monitoring and Logs
- **Application Logs**: Medusa outputs logs to stdout/stderr, captured by PM2
- **PM2 Monitoring**: Use `pm2 monit` for real-time process monitoring
- **Error Tracking**: Check logs for payment processing errors
- **Payment Logs**: Monitor NMI webhook events in application logs
- **Email Logs**: Monitor email sending status in application logs

---

*Last updated: April 22, 2025*