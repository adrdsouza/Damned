# Damned Designs System Overview

This document provides a high-level overview of the Damned Designs e-commerce system architecture and key components. For setup, environment variables, and recovery, see `system-config.md` and `env-variables.md`.

## 1. System Architecture

### Overall Architecture

The system follows a modern e-commerce architecture with separate frontend, backend, and data layers:

- **Frontend Layer**:
  - Next.js Storefront (customer-facing website) - located in `/root/damneddesigns/storefront`
  - Admin Panel (React/Vite based internal management) - located in `/root/damneddesigns/admin`

- **Backend Layer**:
  - Medusa.js Server (e-commerce engine) v2.7.1
  - Payment Services (NMI payment gateway, Sezzle for BNPL, Manual Payment)
  - Various modules (Product, Order, Customer, Inventory management)

- **Data Layer**:
  - PostgreSQL Database (persistent storage)
  - Redis Event Bus (event handling and caching)
  - Local File Storage (product images and assets)

- **External Services**:
  - Custom Image Server (image processing and serving)
  - NMI Payment Gateway (credit card processing)
  - Sezzle Payment Gateway (buy now, pay later)
  - Gmail SMTP (email notifications)

### Technology Stack

#### Backend Components
- **Core**: Medusa.js v2.7.1
- **Runtime**: Node.js 20+
- **Database**: PostgreSQL with MikroORM
- **Event Bus**: Redis
- **File Storage**: Local file storage
- **API**: RESTful API endpoints
- **Payment**: NMI and Sezzle payment integrations, Medusa's default manual payment
- **Email**: Nodemailer with Gmail OAuth2

#### Storefront
- **Framework**: Next.js 15.0.3
- **UI Library**: React 19 (RC)
- **Styling**: Tailwind CSS
- **State Management**: React Query via Medusa's JS SDK (v2.7.1)
- **Package Manager**: npm (yarn removed)
- **Features**: Product pages, cart, checkout, user accounts
- **Directory**: `/root/damneddesigns/storefront`

#### Admin Panel
- **Framework**: Medusa Dashboard v2.7.0 (Vite with React 18)
- **Language**: TypeScript
- **UI Components**: Medusa UI, Radix UI
- **State Management**: React Query (Tanstack Query)
- **Data Grid**: Tanstack Table
- **Internationalization**: i18next
- **Directory**: `/root/damneddesigns/admin`

#### Additional Services
- **Image Server**: Dedicated service for image handling - located in `/root/damneddesigns/images`
- **Process Manager**: PM2 for all Node.js services
- **Web Server**: Caddy for reverse proxy and SSL

## 2. Configuration Details

For all environment variables and setup instructions, see `documentation/env-variables.md` and `documentation/system-config.md`.

## 3. Payment Integrations

### NMI Payment Gateway

#### Overview
The NMI payment integration enables secure credit card processing through Network Merchants Inc payment gateway.

#### Configuration Details
- **Integration Type**: Direct API Integration
- **Test Mode**: Currently in TEST mode
- **API Endpoint**: `https://secure.nmi.com/api/transact.php`
- **Plugin Location**: `/packages/medusa-payment-nmi`
- **Database ID**: `pp_nmi_nmi`

#### Test Credentials (Currently in use)
- **Test Security Key**: `6457Thfj624V5r7WUwc5v6a68Zsd6YEm`

#### Production Credentials (Available when needed)
- **Production Security Key**: `h3WD8p6Hc8WM4eEAqpb6fsTJMYp45Mrp`

#### Features
- ✅ Payment processing (authorization & capture)
- ✅ Payment status tracking
- ✅ Integration with Medusa checkout flow
- ✅ Refunding
- ✅ Webhook handling

#### Test Cards (For use only when in test mode)
- **Visa (Success)**: 4111111111111111
- **Visa (Decline)**: 4111111111111112
- **Mastercard (Success)**: 5431111111111111
- **Mastercard (Decline)**: 5431111111111112
- Use any future expiration date and any 3-4 digit CVV

### Sezzle Payment Gateway

#### Overview
The system is configured for Sezzle "Buy Now, Pay Later" integration, allowing customers to split purchases into four interest-free payments over six weeks. This implementation uses Sezzle's virtual card API.

#### Configuration Details
- **Integration Type**: Virtual Card API Integration
- **Authentication**: Two-step process with token-based auth
- **Mode**: Currently in SANDBOX mode (`SEZZLE_SANDBOX_MODE=true`)
- **API Endpoint**: https://sandbox.gateway.sezzle.com (sandbox)
- **Plugin Location**: `/packages/medusa-payment-sezzle`
- **Database ID**: `pp_sezzle_sezzle`
- **Capture Mode**: Automatic (`SEZZLE_CAPTURE_MODE=automatic`)

#### Sandbox Credentials (Currently in use)
- **Public Key**: `sz_pub_fV7SRB5FuCvueYl07GA5lOObLRjEY6be`
- **Private Key**: `sz_pr_nIhPldbj7QgcZjWffh78GV6kYKgyqBog`

#### Production Credentials (Available when needed)
- **Public Key**: `sz_pub_mHYs860HGQAamnTUWOMfmOOsISn9slaT`
- **Private Key**: `sz_pr_SSKy28nqlOAd5ujZu9w8jEHCvGJ78fBR`

#### Key Features
- ✅ Checkout integration with Sezzle "Buy Now, Pay Later" via virtual card
- ✅ Token-based authentication with expiration management
- ✅ Session creation with customer data
- ✅ Order updates and completion
- ✅ Integration with Medusa checkout flow

#### Test Card Information (For use only when in sandbox mode)
- Visa: 4242424242424242
- Mastercard: 5555555555554444
- Amex: 371449635398431
- Test OTP: 123123

#### Documentation
See the complete Sezzle integration documentation at `/documentation/Sezzle.md`

### Manual Payment Method

#### Overview
The system uses Medusa's built-in manual payment provider for offline payment options.

#### Configuration Details
- **Provider ID**: `pp_system_default`
- **Configuration**: Built into Medusa, no additional setup required
- **Implementation**: Defined in storefront via the `isManual()` function in `/storefront/src/lib/constants.tsx`

## 4. Email Integration (SMTP)

### Overview
The system uses Medusa's built-in nodemailer plugin to send transactional emails via Gmail SMTP with OAuth2 authentication.

### Configuration Details
- **Provider**: Gmail SMTP with OAuth2
- **From Address**: info@damneddesigns.com
- **Templates**: Pug templates in `/backend/data/emailTemplates/`
- **Documentation**: For complete details, see `/documentation/EMAIL-SYSTEM.md`

### Email Types
- Order confirmations (`orderplaced`)
- Order shipment notifications (`order-shipped`)
- Order cancellations (`order-canceled`)
- Password resets (`password-reset`)
- Admin invitations (`invite`)
- Order returns/refunds (`order-return`)

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
module.exports = {
  apps: [
    {
      // Backend Medusa Server in production mode with admin disabled
      name: "backend",
      cwd: "/root/damneddesigns/backend",
      script: "npx",
      args: "medusa start --port 9000",
      env: {
        NODE_ENV: "production"
      },
      time: true,
      autorestart: true,
      max_restarts: 10,
      watch: false,
      instances: 1,
      exec_mode: "fork"
    },
    {
      // Storefront Next.js Server (Production Mode)
      name: "storefront",
      cwd: "/root/damneddesigns/storefront",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },    
      time: true,
      autorestart: true,
      max_restarts: 10,
      watch: false,
      instances: 1,
      exec_mode: "fork"
    },
    {
      // Images Server
      name: "images",
      cwd: "/root/damneddesigns/images",
      script: "index.js",
      env: {
        NODE_ENV: "production",
      },
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
- **Restart specific service**: `pm2 restart backend`
- **Stop specific service**: `pm2 stop damned-designs-frontend`
- **Stop all services**: `pm2 stop all`
- **View logs**: `pm2 logs` or `pm2 logs backend`
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
- **Start All Services**: `/root/damneddesigns/start-pm2.sh` - Builds and starts all services with PM2
- **Storefront Development**: `/root/damneddesigns/storefront-dev.sh` - Runs storefront in development mode
- **Backend Build/Start**: `/root/damneddesigns/backend/build-and-start.sh` - Builds and starts backend only
- **Payment Testing**: `/root/damneddesigns/test-payment-providers.sh` - Tests payment provider connectivity

## 6. System Management

### Server Environment
- **Operating System**: Linux
- **Node.js Version**: 20.x
- **Memory**: Minimum 2GB RAM recommended for production
- **Storage**: Minimum 20GB for media files and database
- **Server IP**: 172.245.105.195

### Web Server (Caddy)

#### Overview
Caddy is used as a reverse proxy, static file server, and SSL certificate manager, handling all HTTPS connections and routing traffic to the appropriate internal services or serving static files directly.

#### API Access Architecture
The system uses a strategic approach to API access with different endpoints for different client types:

> **Important Note**: Always use `127.0.0.1` instead of `localhost` in the Caddyfile to ensure consistent networking behavior. This prevents potential issues with IPv4/IPv6 resolution that can cause connection refused errors.

1. **Separated API Domains and Paths**
   * **Admin-specific API endpoint**: `https://admin.damneddesigns.com/api/*`
     * Used exclusively by the admin panel 
     * Accesses admin-specific API routes with elevated permissions
     * Configured in admin .env: `VITE_MEDUSA_BACKEND_URL="https://admin.damneddesigns.com/api"`

   * **Storefront-specific API endpoint**: `https://api.damneddesigns.com/*`
     * Used by the storefront for all API requests
     * Accesses store-specific API routes intended for public use
     * Configured in frontend .env: `MEDUSA_BACKEND_URL=https://api.damneddesigns.com`

2. **Benefits of This Architecture**
   * **Enhanced Security**: Separation of admin and storefront API access provides security boundaries
   * **Clearer Permissions Model**: Admin routes remain isolated from storefront routes
   * **Better Monitoring**: Easier to track and debug issues specific to either interface
   * **Operational Flexibility**: Can apply different rate limiting, caching, or security policies to each

#### Configuration
The Caddy configuration file is located at `/etc/caddy/Caddyfile` and contains the following:

```
damneddesigns.com {
    reverse_proxy 127.0.0.1:8000
}

admin.damneddesigns.com {
    # API requests
    @api {
        path /api/*
    }
    handle @api {
        uri strip_prefix /api
        reverse_proxy 127.0.0.1:9000
    }

    # Admin auth endpoints directly
    @auth {
        path /auth/*
    }
    handle @auth {
        reverse_proxy 127.0.0.1:9000
    }
    
    # All non-API/auth requests serve static files
    root * /root/damneddesigns/admin/dist
    encode gzip
    file_server
    try_files {path} /index.html
}

images.damneddesigns.com {
    reverse_proxy 127.0.0.1:6162
}

api.damneddesigns.com {
    header {
        Access-Control-Allow-Origin "https://admin.damneddesigns.com"
        Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Access-Control-Allow-Headers "Content-Type, Authorization"
        Access-Control-Allow-Credentials true
        Access-Control-Max-Age "3600"
        defer
    }
    reverse_proxy 127.0.0.1:9000
}
```

> **Note**: The storefront runs on port 8000 (Next.js production server) as configured in package.json.

#### Security Architecture
The system employs a secure architecture where backend services are never directly exposed to the internet:

1. **Backend API Service**: Runs exclusively on localhost (127.0.0.1:9000) and is not directly accessible from the public internet
2. **Admin Panel Static Files**: Served directly by Caddy from `/root/damneddesigns/admin/dist` without requiring a Node.js process
3. **Secure Proxy Layers with Separated Concerns**: 
   - Caddy functions as a reverse proxy and static file server for all domains, providing a security layer
   - All external traffic must pass through Caddy before reaching any service
   - Two different API access points are configured for different clients:
     * `https://admin.damneddesigns.com/api/*` - for admin panel API access (admin-specific routes)
     * `https://api.damneddesigns.com/*` - dedicated API domain (used by storefront)

3. **Client Communication Patterns**:
   - Storefront frontend: Connects to backend via `https://api.damneddesigns.com`
   - Admin panel: Connects to backend via `https://admin.damneddesigns.com/api`
   - These different paths access different parts of the Medusa API:
     * Admin panel accesses `/admin/*` routes with elevated permissions
     * Storefront accesses `/store/*` routes with public permissions
4. **TLS Encryption**: All traffic is secured with HTTPS via Let's Encrypt certificates

Caddy automatically handles SSL certificate provisioning and renewal through Let's Encrypt.

#### Service Management
- **Start Caddy**: `systemctl start caddy`
- **Stop Caddy**: `systemctl stop caddy`
- **Restart Caddy**: `systemctl restart caddy`
- **Check Status**: `systemctl status caddy`
- **View Logs**: `journalctl -u caddy`

#### DNS Configuration
- **damneddesigns.com**: Points to 172.245.105.195 (A record)
- **admin.damneddesigns.com**: Points to 172.245.105.195 (A record)
- **images.damneddesigns.com**: Points to 172.245.105.195 (A record)
- **api.damneddesigns.com**: Points to 172.245.105.195 (A record)

## 7. Key Features

### Backend Features
- Product management (creation, update, variants)
- Inventory management
- Order processing
- Customer management and authentication
- Pricing and tax calculation
- Discount handling
- Payment processing (NMI, Sezzle, Manual)
- Shipping method management
- Returns and exchanges
- Multi-currency support
- Email notifications via Gmail SMTP

### Frontend Storefront Features
- Product browsing and filtering
- Product detail pages with variants
- Shopping cart functionality
- User authentication and accounts
- Checkout process with multiple payment options
- Order history and tracking
- Mobile responsiveness (Tailwind CSS)
- Performance optimizations:
  - Server-side rendering
  - Dynamic rendering for product pages
  - Next.js App Router

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

## 8. Maintenance and Recovery

For all reset, recovery, and troubleshooting steps, see `documentation/system-config.md`.

### Important Directories
- **Backend**: `/root/damneddesigns/backend` - Medusa.js server
- **Storefront**: `/root/damneddesigns/storefront` - Next.js storefront for customers
- **Admin**: `/root/damneddesigns/admin` - Medusa admin dashboard
- **Images**: `/root/damneddesigns/images` - Custom image service
- **Packages**: `/root/damneddesigns/packages` - Custom plugins including payment providers
- **Documentation**: `/root/damneddesigns/documentation` - System documentation

### Database Management
- **Connection**: PostgreSQL at `postgres://myuser:adrdsouza@localhost/medusa-medusaapp`
- **Backup**: Schedule daily PostgreSQL dumps
  ```bash
  pg_dump -U myuser -d medusa-medusaapp > backup_$(date +%Y%m%d).sql
  ```
- **Restore**: Restore from a backup file
  ```bash
  psql -U myuser -d medusa-medusaapp < backup_file.sql
  ```

---

*Last updated: May 2, 2025 (System versions: Medusa 2.7.1, Next.js 15.0.3, Admin 2.7.0, Payment providers in production mode)*