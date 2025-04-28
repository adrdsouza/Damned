# Damned Designs System Overview

This document provides a comprehensive overview of the Damned Designs e-commerce system architecture, configuration, and key components.

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
- **Payment**: Custom NMI and Sezzle payment integrations, Medusa's default manual payment
- **Email**: Nodemailer with Gmail OAuth2

#### Storefront
- **Framework**: Next.js 15.0.3
- **UI Library**: React 19 (RC)
- **Styling**: Tailwind CSS
- **State Management**: React Query via Medusa's JS SDK (latest version)
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
- **Image Server**: Dedicated service for image handling - located in `/root/damneddesigns/images/images`
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

#### Storefront (`.env`)
```
# Using the dedicated API subdomain for backend communication
MEDUSA_BACKEND_URL=https://api.damneddesigns.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_37d4b273553c24414059314072f8423064879e3233e4022a85081d7703a5dfbf
NEXT_PUBLIC_BASE_URL=https://damneddesigns.com
NEXT_PUBLIC_DEFAULT_REGION=us
NEXT_PUBLIC_STRIPE_KEY=pk_test_placeholder
REVALIDATE_SECRET=supersecret
```

#### Admin Panel (`.env`)
```
# Using the /api path on the admin domain for backend communication
VITE_MEDUSA_BACKEND_URL="https://admin.damneddesigns.com/api"
VITE_MEDUSA_STOREFRONT_URL="https://damneddesigns.com"
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
- **Payment Gateway Config**: 
  - NMI: Configuration in `.env` and `/packages/medusa-payment-nmi`
  - Sezzle: Configuration in `.env` and `/packages/medusa-payment-sezzle`

## 3. Payment Integrations

### NMI Payment Gateway

#### Overview
The NMI payment integration enables secure credit card processing through Network Merchants Inc payment gateway.

#### Configuration Details
- **Integration Type**: Direct API Integration
- **Test Mode**: Currently enabled (`NMI_TEST_MODE=enabled`)
- **API Endpoint**: `https://secure.nmi.com/api/transact.php`
- **Plugin Location**: `/packages/medusa-payment-nmi`
- **Database ID**: `pp_nmi_nmi`

#### Test Credentials
- **Test Security Key**: `6457Thfj624V5r7WUwc5v6a68Zsd6YEm`

#### Production Credentials (Not currently in use)
- **Production Security Key**: `h3WD8p6Hc8WM4eEAqpb6fsTJMYp45Mrp`
- **Production Checkout Public Key**: `checkout_public_2he6c5yTBC73u3AV2reJeHb37TpEegUa`

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
The system is configured for Sezzle "Buy Now, Pay Later" integration, allowing customers to split purchases into four interest-free payments over six weeks. This implementation uses Sezzle's virtual card API.

#### Configuration Details
- **Integration Type**: Virtual Card API Integration
- **Authentication**: Two-step process with token-based auth
- **Test Mode**: Currently in sandbox mode
- **API Endpoint**: https://sandbox.gateway.sezzle.com (sandbox), https://gateway.sezzle.com (production)
- **Plugin Location**: `/packages/medusa-payment-sezzle`
- **Database ID**: `pp_sezzle_sezzle`

#### Test Credentials
- **Sandbox Public Key**: `sz_pub_fV7SRB5FuCvueYl07GA5lOObLRjEY6be`
- **Sandbox Private Key**: `sz_pr_nIhPldbj7QgcZjWffh78GV6kYKgyqBog`
- **Sandbox Mode**: Currently enabled (`true`)

#### Key Features
- ✅ Checkout integration with Sezzle "Buy Now, Pay Later" via virtual card
- ✅ Token-based authentication with expiration management
- ✅ Session creation with customer data
- ✅ Order updates and completion
- ✅ Integration with Medusa checkout flow

#### Test Card Information
For testing in sandbox mode:
- Visa: 4242424242424242
- Mastercard: 5555555555554444
- Amex: 371449635398431
- Test OTP: 123123

#### Documentation
See the complete Sezzle integration documentation at `/documentation/Sezzle.md`

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
      name: "damned-designs-storefront",
      cwd: "/root/damneddesigns/storefront",
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
      name: "damned-designs-images",
      cwd: "/root/damneddesigns/images/images",
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
Caddy is used as a reverse proxy and SSL certificate manager, handling all HTTPS connections and routing traffic to the appropriate internal services.

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
   * **Future Scalability**: Supports independently scaling admin vs. storefront traffic if needed

#### Installation
```bash
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install caddy
```

#### Configuration
The Caddy configuration file is located at `/etc/caddy/Caddyfile` and contains the following:

```
damneddesigns.com {
    handle_path /api/* {
        uri strip_prefix /api
        reverse_proxy 127.0.0.1:9000
    }
    
    handle {
        reverse_proxy 127.0.0.1:8000
    }
}

admin.damneddesigns.com {
    handle_path /api/* {
        uri strip_prefix /api
        reverse_proxy 127.0.0.1:9000
    }
    
    handle {
        reverse_proxy 127.0.0.1:5173
        @notFound {
            path_regexp notfound ^/([^.]+)$
            not path /
        }
        rewrite @notFound /
    }
}

images.damneddesigns.com {
    reverse_proxy 127.0.0.1:6162
}

api.damneddesigns.com {
    reverse_proxy 127.0.0.1:9000
}
```

> **Note**: The frontend runs on port 8000 (Next.js production server) as configured in package.json.

#### Security Architecture
The system employs a secure architecture where backend services are never directly exposed to the internet:

1. **Backend API Service**: Runs exclusively on localhost (127.0.0.1:9000) and is not directly accessible from the public internet
2. **Secure Proxy Layers with Separated Concerns**: 
   - Caddy functions as a reverse proxy for all domains, providing a security layer
   - All external traffic must pass through Caddy before reaching any service
   - Three different API access points are configured for different clients:
     * `https://damneddesigns.com/api/*` - for storefront API path-based access
     * `https://admin.damneddesigns.com/api/*` - for admin panel API access (admin-specific routes)
     * `https://api.damneddesigns.com/*` - dedicated API domain (used by storefront)

3. **Client Communication Patterns**:
   - Storefront frontend: Connects to backend via `https://api.damneddesigns.com`
   - Admin panel: Connects to backend via `https://admin.damneddesigns.com/api`
   - These different paths access different parts of the Medusa API:
     * Admin panel accesses `/admin/*` routes with elevated permissions
     * Storefront accesses `/store/*` routes with public permissions
   - This separation enhances security by isolating admin functionality from public storefront access
4. **TLS Encryption**: All traffic is secured with HTTPS via Let's Encrypt certificates

This pattern ensures that all backend services remain internal while still allowing the necessary communication between frontend applications and backend services. The backend itself cannot be accessed directly from the internet, maintaining security while enabling functionality.

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
      name: "damned-designs-storefront",
      cwd: "/root/damneddesigns/storefront",
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
      name: "damned-designs-images",
      cwd: "/root/damneddesigns/images/images",
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

### Storefront Deployment
1. Set correct environment variables for the storefront:
   ```
   # Environment variables in /root/damneddesigns/storefront/.env
   MEDUSA_BACKEND_URL=https://api.damneddesigns.com
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_37d4b273553c24414059314072f8423064879e3233e4022a85081d7703a5dfbf
   NEXT_PUBLIC_BASE_URL=https://damneddesigns.com
   NEXT_PUBLIC_DEFAULT_REGION=us
   NEXT_PUBLIC_STRIPE_KEY=pk_test_placeholder
   REVALIDATE_SECRET=supersecret
   ```

2. Storefront is deployed in production mode:
   ```bash
   # Build and start the Next.js storefront in production mode
   cd /root/damneddesigns/storefront
   npm run build
   pm2 start npm --name damned-designs-storefront -- run start
   ```

3. The frontend includes:
   - Basic storefront pages (Home, Products, About)
   - Checkout flow with support for the following payment methods:
     - Manual Payment (pp_system_default) - Medusa's built-in payment method
     - Credit Card via NMI (nmi_nmi) - Currently in test mode
     - Sezzle Buy Now, Pay Later (sezzle_sezzle) - Currently in sandbox mode
   - Responsive design using Tailwind CSS

4. Payment Infrastructure:
   - NMI payment gateway: Configured in medusa-config.ts with test credentials
   - Sezzle payment integration: Configured in medusa-config.ts using virtual card API
   - Custom payment plugins located in `/root/damneddesigns/packages/`

5. Testing payment methods:
   - NMI Test Cards:
     - Success: 4111111111111111
     - Decline: 4111111111111112
   - Sezzle Test Cards (used after virtual card issuance):
     - Visa: 4242424242424242
     - Mastercard: 5555555555554444
     - Test OTP: 123123

> **Note**: The frontend is running in production mode with a streamlined user interface to ensure optimal performance and stability.

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

### Admin Panel Production Setup
The Admin Panel is built with Vite and deployed in production mode following these steps:

1. Environment configuration in `/root/damneddesigns/admin/.env`:
   ```
   VITE_MEDUSA_BACKEND_URL="http://localhost:9000"
   VITE_MEDUSA_STOREFRONT_URL="https://damneddesigns.com"
   ```

2. Build configuration in `/root/damneddesigns/admin/vite.config.mts`:
   ```js
   preview: {
     host: "0.0.0.0",
     port: 5173,
     allowedHosts: ["admin.damneddesigns.com"]
   }
   ```

3. Production build process:
   ```bash
   cd /root/damneddesigns/admin
   npm run build:preview  # Builds the production assets
   ```

4. Production deployment with PM2:
   ```bash
   pm2 restart damned-designs-admin  # Runs npm run preview command
   ```

5. Caddy reverse proxy configuration for admin panel:
   ```
   admin.damneddesigns.com {
       handle_path /api/* {
           uri strip_prefix /api
           reverse_proxy 127.0.0.1:9000
       }
       
       handle {
           reverse_proxy 127.0.0.1:5173
           @notFound {
               path_regexp notfound ^/([^.]+)$
               not path /
           }
           rewrite @notFound /
       }
   }
   ```

## 9. Maintenance and Recovery

### Important Directories
- **Backend**: `/root/damneddesigns/backend` - Medusa.js server
- **Storefront**: `/root/damneddesigns/storefront` - Next.js storefront for customers
- **Admin**: `/root/damneddesigns/admin` - Medusa admin dashboard
- **Images**: `/root/damneddesigns/images/images` - Custom image service
- **NMI Plugin**: `/root/damneddesigns/packages/medusa-payment-nmi` - Payment integration

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

### Complete System Reinstallation Guide

If you need to reinstall the system on a new server, follow these steps in order:

1. **System Prerequisites**
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Node.js 20.x
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt install -y nodejs
   
   # Install PostgreSQL
   apt install -y postgresql postgresql-contrib
   
   # Install Redis
   apt install -y redis-server
   
   # Install PM2
   npm install -g pm2
   
   # Install Caddy
   apt install -y debian-keyring debian-archive-keyring apt-transport-https
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
   apt update
   apt install caddy
   ```

2. **Database Setup**
   ```bash
   # Create database user
   sudo -u postgres psql -c "CREATE USER myuser WITH PASSWORD 'adrdsouza';"
   
   # Create database
   sudo -u postgres psql -c "CREATE DATABASE \"medusa-medusaapp\" OWNER myuser;"
   
   # Verify connection
   psql -U myuser -d medusa-medusaapp -h localhost
   ```

3. **Code Installation**
   ```bash
   # Create main directory
   mkdir -p /root/damneddesigns
   cd /root/damneddesigns
   
   # Clone repositories or extract from backup
   # (Replace with your actual repository URLs or backup restoration commands)
   git clone https://your-repo-url.git/backend
   git clone https://your-repo-url.git/storefront
   git clone https://your-repo-url.git/admin
   git clone https://your-repo-url.git/images
   mkdir -p packages
   git clone https://your-repo-url.git/packages/medusa-payment-nmi
   ```

4. **Environment Configuration**
   ```bash
   # Copy environment files from backups or create new ones
   # Backend .env
   cp /path/to/backup/backend/.env /root/damneddesigns/backend/.env
   
   # Storefront .env
   cp /path/to/backup/storefront/.env /root/damneddesigns/storefront/.env
   
   # Admin .env
   cp /path/to/backup/admin/.env /root/damneddesigns/admin/.env
   
   # Make sure the environment files have the correct values
   # Particularly check backend URLs and API keys
   ```

5. **PM2 Configuration**
   ```bash
   # Copy ecosystem.config.js from backup or create new one
   cp /path/to/backup/ecosystem.config.js /root/damneddesigns/
   
   # Ensure it has the correct configuration for all services
   # See the PM2 Configuration section in this document
   ```

6. **Caddy Configuration**
   ```bash
   # Configure Caddy
   cat > /etc/caddy/Caddyfile << 'EOL'
   damneddesigns.com {
       handle_path /api/* {
           uri strip_prefix /api
           reverse_proxy 127.0.0.1:9000
       }
       
       handle {
           reverse_proxy 127.0.0.1:8000
       }
   }
   
   admin.damneddesigns.com {
       handle_path /api/* {
           uri strip_prefix /api
           reverse_proxy 127.0.0.1:9000
       }
       
       handle {
           reverse_proxy 127.0.0.1:5173
           @notFound {
               path_regexp notfound ^/([^.]+)$
               not path /
           }
           rewrite @notFound /
       }
   }
   
   images.damneddesigns.com {
       reverse_proxy 127.0.0.1:6162
   }
   
   api.damneddesigns.com {
       reverse_proxy 127.0.0.1:9000
   }
   EOL
   
   # Apply Caddy configuration
   systemctl restart caddy
   ```

7. **Build and Start Backend**
   ```bash
   cd /root/damneddesigns/backend
   npm install
   npm run build
   # Migrations
   npx medusa migrations run
   ```

8. **Build and Start Storefront**
   ```bash
   cd /root/damneddesigns/storefront
   npm install
   npm run build
   ```

9. **Build and Start Admin Panel**
   ```bash
   cd /root/damneddesigns/admin
   npm install
   npm run build:preview
   ```

10. **Start All Services with PM2**
    ```bash
    cd /root/damneddesigns
    pm2 start ecosystem.config.js
    
    # Save PM2 configuration to start on boot
    pm2 save
    pm2 startup
    ```

11. **Verify All Services**
    ```bash
    # Check service status
    pm2 list
    
    # Check logs for errors
    pm2 logs
    
    # Check Caddy status
    systemctl status caddy
    
    # Test API health
    curl -s https://api.damneddesigns.com/health
    ```

12. **DNS Configuration**
    * Set up DNS A records for all domains to point to your server IP:
      * damneddesigns.com → Server IP
      * admin.damneddesigns.com → Server IP
      * api.damneddesigns.com → Server IP
      * images.damneddesigns.com → Server IP

## 10. Monitoring and Logs
- **Application Logs**: Medusa outputs logs to stdout/stderr, captured by PM2
- **PM2 Monitoring**: Use `pm2 monit` for real-time process monitoring
- **Error Tracking**: Check logs for payment processing errors
- **Payment Logs**: Monitor NMI webhook events in application logs
- **Email Logs**: Monitor email sending status in application logs
- **Caddy Certificate Logs**: Check certificate issuance and renewal with `journalctl -u caddy | grep certificate`

## 11. Troubleshooting

### Common Issues and Solutions

#### Database Schema Mismatches
- **Problem**: "column i1.is_giftcard does not exist" error when adding products to cart
- **Solution**:
  1. Connect to the PostgreSQL database:
     ```bash
     psql -U myuser -d medusa-medusaapp
     ```
  2. Check if the column exists:
     ```sql
     SELECT column_name FROM information_schema.columns 
     WHERE table_name='cart_line_item' AND column_name='is_giftcard';
     ```
  3. Add the missing column if it doesn't exist:
     ```sql
     ALTER TABLE cart_line_item ADD COLUMN is_giftcard BOOLEAN NOT NULL DEFAULT FALSE;
     ```
  4. Restart the backend and storefront services:
     ```bash
     pm2 restart damned-designs-backend damned-designs-storefront
     pm2 save
     ```
  5. This issue occurs because Medusa 2.7.1 expects certain database schema elements that might not exist in your database if upgraded from an earlier version

#### Payment Method Update
- **Change**: The custom COD (Cash on Delivery) payment method has been replaced with Medusa's built-in manual payment method
- **Current Configuration**: The system now uses Medusa's standard manual payment provider (`pp_system_default`)
- **Implementation**: 
  1. The payment button component handles the manual payment method:
     ```
     /root/damneddesigns/storefront/src/modules/checkout/components/payment-button/index.tsx
     ```
  2. The manual payment method is defined in the constants file:
     ```javascript
     // In /storefront/src/lib/constants.tsx
     export const isManual = (providerId?: string) => {
       return providerId?.startsWith("pp_system_default")
     }
     ```
  3. The payment button component uses a `ManualTestPaymentButton` for checkout:
     ```javascript
     // In payment-button/index.tsx
     case isManual(paymentSession?.provider_id):
       return (
         <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
       )
     ```
  4. After making any modifications to payment components, restart the storefront:
     ```bash
     pm2 restart damned-designs-storefront
     pm2 save
     ```
  5. For more details on the manual payment implementation, see `/documentation/COD.md`

#### Product Page 500 Errors
- **Problem**: Server-side rendering errors on product pages
- **Solution**:
  1. Use dynamic rendering for product pages instead of static generation:
     ```javascript
     // In /storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx
     export const dynamic = 'force-dynamic'
     ```
  2. This ensures the page is always rendered on-demand with fresh data
  3. Another approach is to use incremental static regeneration with a low revalidation time
  4. Ensure middleware.ts has proper error handling for region detection

#### Storefront to Backend Connection Issues
- **Problem**: Storefront not connecting to the Medusa backend API
- **Solution**:
  1. Ensure the `MEDUSA_BACKEND_URL` in the storefront `.env` file is set to `https://api.damneddesigns.com` (not localhost)
  2. Make sure the Caddy configuration includes these proxy rules:
     - `api.damneddesigns.com` → `127.0.0.1:9000` (for direct API access)
     - `damneddesigns.com/api/*` → `127.0.0.1:9000` (for path-based API access)
  3. Verify the storefront's Medusa client is using `@medusajs/medusa-js` correctly:
     ```js
     import Medusa from '@medusajs/medusa-js';

     const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'https://api.damneddesigns.com';
     
     export const medusaClient = new Medusa({
       baseUrl: BACKEND_URL,
       maxRetries: 3,
     });
     ```
  4. Ensure DNS entries are set up for all subdomains (damneddesigns.com, admin.damneddesigns.com, api.damneddesigns.com, images.damneddesigns.com)
  5. Try accessing `https://api.damneddesigns.com/health` directly to verify API connectivity

#### SSL Certificate Issues
- **Problem**: Caddy fails to issue Let's Encrypt certificates for domains
- **Solution**: 
  1. Verify DNS A records point to the server IP (172.245.105.195)
  2. Ensure the service is running and bound to 0.0.0.0 (not just localhost)
  3. Check Caddy logs: `journalctl -u caddy | grep -i "certificate"`
  4. Restart Caddy: `systemctl restart caddy`

#### Caddy Connection Refused Errors
- **Problem**: Caddy logs show "dial tcp [::1]:8000: connect: connection refused" errors
- **Solution**:
  1. Check that all services are running: `pm2 list`
  2. Verify services are listening on correct ports: `ss -tlnp | grep -E '8000|9000|5173|6162'`
  3. Make sure Caddyfile uses `127.0.0.1` instead of `localhost` for all reverse proxies
  4. Restart affected services: `pm2 restart damned-designs-storefront`
  5. Restart Caddy: `systemctl restart caddy`
  6. Check Caddy logs again: `journalctl -u caddy | tail -50`

#### Admin Panel Connection Refused
- **Problem**: Caddy logs show "dial tcp [::1]:5173: connect: connection refused"
- **Solution**:
  1. Verify the admin service is running: `pm2 status damned-designs-admin`
  2. Check the vite.config.mts has the host set to "0.0.0.0" 
  3. Confirm the .env file points to the correct backend URL
  4. Rebuild if needed: `cd /root/damneddesigns/admin && npm run build:preview`
  5. Restart the service: `pm2 restart damned-designs-admin`

#### Admin Panel to Backend Connection Issues
- **Problem**: Admin panel cannot communicate with the Medusa backend API
- **Solution**:
  1. Verify the admin `.env` file has `VITE_MEDUSA_BACKEND_URL="https://admin.damneddesigns.com/api"` (using the API path on the admin domain)
  2. Make sure the Caddy configuration includes the proxy rule:
     - `admin.damneddesigns.com/api/*` → `127.0.0.1:9000` (for admin API access)
  3. Check the backend CORS settings in `/root/damneddesigns/backend/.env` includes:
     - `ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com,https://damneddesigns.com,https://admin.damneddesigns.com`
  4. Verify connectivity by accessing `https://admin.damneddesigns.com/api/health`
  5. Check admin panel logs: `pm2 logs damned-designs-admin`

#### Backend API Connection Issues
- **Problem**: Admin panel cannot connect to the backend API
- **Solution**:
  1. Verify backend service is running: `pm2 status damned-designs-backend`
  2. Check admin .env file has correct backend URL
  3. Ensure backend is listening on the configured port
  4. Check CORS settings in backend .env file allows admin domain

---

*Last updated: April 28, 2025 (System versions updated - Medusa 2.7.1, Next.js 15.0.3, Admin 2.7.0, COD removed, Manual payment added)*

## System Backups and Restoration

The system is backed up using a comprehensive backup solution. Full details can be found in the dedicated backup documentation at `/root/damneddesigns/documentation/BACKUP.md`.

### Key Features
- Incremental backup system for space efficiency
- Daily, weekly, and monthly backup rotation
- Full database backups
- Google Drive integration for off-site storage
- Comprehensive restore script with multiple options

### Restoration Process

To restore the system from backup:

```bash
/root/damneddesigns/restore.sh --list         # List all available backups
/root/damneddesigns/restore.sh --incremental weekly/week25_2025  # Restore from weekly backup
/root/damneddesigns/restore.sh --standard damneddesigns_backup_20250423_123456.tar.gz  # Restore from standard backup
/root/damneddesigns/restore.sh --db-only db_backups/weekly/medusa_db_week25_2025.sql.gz  # Restore only the database
```

The restore script handles all the necessary steps including stopping services, backing up current state, restoring files, and restarting services.