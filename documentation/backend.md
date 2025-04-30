# Damned Designs Backend Documentation

## Overview

The Damned Designs backend is a Medusa.js-based e-commerce engine that powers the entire shopping experience. This document provides detailed information about the backend architecture, configuration, development workflow, and troubleshooting.

## Architecture & Components

### Core Components

- **Framework**: Medusa.js v2.7.1
- **Directory**: `/root/damneddesigns/backend`
- **Runtime Environment**: Node.js 20+
- **Database**: PostgreSQL with MikroORM
- **Event Bus**: Redis (for event handling and caching)
- **API Structure**: RESTful endpoints following Medusa conventions

### Key Directories

- **Root**: `/root/damneddesigns/backend`
- **Production Server**: `/root/damneddesigns/backend/.medusa/server` (built code)
- **Configuration**: `/root/damneddesigns/backend/medusa-config.ts`
- **Custom Subscribers**: `/root/damneddesigns/backend/src/subscribers`
- **Integration Tests**: `/root/damneddesigns/backend/integration-tests`

### Custom Modules & Extensions

The backend includes several custom extensions to the core Medusa functionality:

1. **Custom Payment Providers**:
   - NMI Credit Card Processing (packages/medusa-payment-nmi)
   - Sezzle Buy Now, Pay Later (packages/medusa-payment-sezzle)
   - Manual Payment (Medusa's built-in system default provider)

2. **Custom API Endpoints**:
   - Health check endpoint `/health`
   - Custom order processing endpoints
   - Payment webhook receivers for NMI and Sezzle

## Configuration Details

### Environment Variables

The backend configuration relies on environment variables defined in `/root/damneddesigns/backend/.env`. Critical variables include:

```
STORE_CORS=http://localhost:8000,https://docs.medusajs.com,https://damneddesigns.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com,https://damneddesigns.com,https://admin.damneddesigns.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com,https://damneddesigns.com,https://admin.damneddesigns.com
REDIS_URL=redis://localhost:6379
JWT_SECRET=d9c01c57d4f64e8b9a36b3297a4cf6c2e98b1f4a5e7c3d2b
COOKIE_SECRET=e8f2a7d6c3b9e5f1a4d2c7b3e5f9a8d6c3b2e5f8a7d9c6
DATABASE_URL=postgres://myuser:adrdsouza@localhost/medusa-medusaapp
SERVER_LINK=https://api.damneddesigns.com
IMAGE_SERVER_URL=https://images.damneddesigns.com

# NMI Payment Provider
NMI_SECURITY_KEY=h3WD8p6Hc8WM4eEAqpb6fsTJMYp45Mrp
NMI_CHECKOUT_PUBLIC_KEY=checkout_public_2he6c5yTBC73u3AV2reJeHb37TpEegUa

# Sezzle Payment Provider
SEZZLE_PRIVATE_KEY=sz_pr_SSKy28nqlOAd5ujZu9w8jEHCvGJ78fBR
SEZZLE_PUBLIC_KEY=sz_pub_mHYs860HGQAamnTUWOMfmOOsISn9slaT
SEZZLE_API_MODE=sandbox
```

### Database Schema

The database follows Medusa's schema design with the following key tables:

- `product` - Product catalog information
- `product_variant` - Product variations (sizes, colors, etc.)
- `product_option` - Options for products
- `order` - Customer orders
- `cart` - Shopping carts
- `customer` - Customer accounts and information
- `shipping_option` - Available shipping methods
- `payment_provider` - Payment provider configuration
- `region` - Regional settings (currency, taxes, etc.)

## Development Workflow

### Local Development

For local development:

1. Start the backend service in development mode:
   ```bash
   cd /root/damneddesigns/backend
   npm run dev
   ```

2. This launches the Medusa server with hot-reloading on port 9000.

### Building for Production

The backend uses a custom build script that handles transpilation, dependency installation, and environment setup:

```bash
cd /root/damneddesigns/backend
./build-and-start.sh
```

This script:
1. Runs `npm run build` to transpile TypeScript to JavaScript
2. Changes directory to `.medusa/server`
3. Runs `npm install` to install dependencies in the build directory
4. Copies the `.env` file to `.env.production`
5. Starts the server with `NODE_ENV=production`

## API Access Patterns

The backend provides different API access paths for different clients:

1. **Admin API Access**:
   - Used by: Admin panel
   - Base URL: `https://admin.damneddesigns.com/api`
   - API Routes: `/admin/*`
   - Authentication: Admin JWT tokens

2. **Store API Access**:
   - Used by: Storefront
   - Base URL: `https://api.damneddesigns.com`
   - API Routes: `/store/*`
   - Authentication: Customer tokens, Publishable API key

3. **Publishable API Key**:
   This key is required for all Storefront API requests in Medusa v2.7.1:
   ```
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_37d4b273553c24414059314072f8423064879e3233e4022a85081d7703a5dfbf
   ```

## Payment Processing Flow

### NMI Payment Flow

1. Customer enters payment information in the storefront
2. Frontend calls Medusa's `/store/payment-sessions/session_id` endpoint
3. Backend communicates with NMI's API (`https://secure.nmi.com/api/transact.php`)
4. Payment session is created with status (`authorized` or `declined`)
5. Order is completed if payment is authorized

### Sezzle Payment Flow

1. Customer selects Sezzle payment method at checkout
2. Frontend calls Medusa's `/store/payment-sessions/session_id` endpoint
3. Backend initiates a Sezzle checkout session through Sezzle's API
4. Customer is redirected to Sezzle to complete the payment agreement
5. After completing the agreement, customer is redirected back to the store
6. Sezzle sends a webhook to confirm the payment status
7. Order is completed if payment is authorized

### Testing Payment Providers

#### NMI Test Cards

The NMI integration can be tested with the following test cards:
- **Visa (Success)**: 4111111111111111
- **Visa (Decline)**: 4111111111111112
- **Mastercard (Success)**: 5431111111111111
- **Mastercard (Decline)**: 5431111111111112

#### Sezzle Testing

Sezzle operates in sandbox mode for testing:
- **Mode**: Set `SEZZLE_API_MODE=sandbox` in .env
- **Testing**: Use the Sezzle sandbox environment when redirected
- **Test Account**: Create a test account in the Sezzle sandbox

## Monitoring & Logs

- **Application Logs**: View with `pm2 logs damned-designs-backend`
- **Error Tracking**: All errors are logged to stdout/stderr, captured by PM2
- **PM2 Monitoring**: Use `pm2 monit` for real-time monitoring of the backend

## Common Issues & Troubleshooting

### API Connection Issues

If the backend API is inaccessible:

1. Check if the service is running: `pm2 status damned-designs-backend`
2. Verify the service is listening on port 9000: `ss -tlnp | grep 9000`
3. Check for errors in logs: `pm2 logs damned-designs-backend`
4. Restart if needed: `pm2 restart damned-designs-backend`

### Payment Provider Issues

#### NMI Troubleshooting

Current status: API connectivity established but returning DECLINED responses

If NMI payment processing fails:

1. Verify both NMI keys are correctly set in the `.env` file:
   ```
   NMI_SECURITY_KEY=h3WD8p6Hc8WM4eEAqpb6fsTJMYp45Mrp
   NMI_CHECKOUT_PUBLIC_KEY=checkout_public_2he6c5yTBC73u3AV2reJeHb37TpEegUa
   ```

2. Check backend logs for specific NMI error responses:
   ```bash
   pm2 logs damned-designs-backend | grep NMI
   ```

3. Verify NMI gateway configuration in medusa-config.ts:
   ```typescript
   {
     resolve: "medusa-payment-nmi",
     options: {
       securityKey: process.env.NMI_SECURITY_KEY,
       checkoutPublicKey: process.env.NMI_CHECKOUT_PUBLIC_KEY,
       gatewayUrl: "https://secure.nmi.com/api/transact.php",
     }
   }
   ```

4. Test with the known working test card: 4111111111111111

5. If still getting DECLINED responses, verify in the NMI merchant dashboard that:
   - The security key has transaction processing permissions
   - The merchant account is active
   - The gateway is properly configured for test transactions

#### Sezzle Troubleshooting

Current status: Failing with 401 Unauthorized errors

If Sezzle payment processing fails:

1. Verify Sezzle keys are correctly set in the `.env` file:
   ```
   SEZZLE_PRIVATE_KEY=sz_pr_SSKy28nqlOAd5ujZu9w8jEHCvGJ78fBR
   SEZZLE_PUBLIC_KEY=sz_pub_mHYs860HGQAamnTUWOMfmOOsISn9slaT
   SEZZLE_API_MODE=sandbox
   ```

2. Check backend logs for specific Sezzle error responses:
   ```bash
   pm2 logs damned-designs-backend | grep -i sezzle
   pm2 logs damned-designs-backend | grep -i "401"
   ```

3. Verify Sezzle configuration in medusa-config.ts:
   ```typescript
   {
     resolve: "medusa-payment-sezzle",
     options: {
       publicKey: process.env.SEZZLE_PUBLIC_KEY,
       privateKey: process.env.SEZZLE_PRIVATE_KEY,
       apiMode: process.env.SEZZLE_API_MODE || "sandbox",
     }
   }
   ```

4. Ensure the API mode matches the key type (sandbox keys must be used with sandbox mode)

5. Verify webhook configuration is correctly set up for receiving Sezzle callbacks

#### Publishable API Key Issues

The publishable API key is required for all storefront API requests in Medusa v2.7.1:

1. Verify the key is set correctly in both backend and storefront:
   ```
   # Backend (created and managed by admin)
   # Storefront .env
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_37d4b273553c24414059314072f8423064879e3233e4022a85081d7703a5dfbf
   ```

2. Check if the key has expired or been revoked in the admin panel

3. Ensure the key is correctly associated with sales channels

4. Verify the Medusa client in the storefront is configured to use the key:
   ```javascript
   const medusaClient = new Medusa({
     baseUrl: MEDUSA_BACKEND_URL,
     maxRetries: 3,
     publishableApiKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
   })
   ```

### Database Connection Issues

If database connection fails:

1. Check database connection string in `.env`
2. Verify PostgreSQL is running: `systemctl status postgresql`
3. Test direct connection: `psql -U myuser -d medusa-medusaapp -h localhost`
4. Restart PostgreSQL if needed: `systemctl restart postgresql`

## Backup & Recovery

The backend includes automatic database backups:

1. Daily incremental backups
2. Weekly full backups
3. Restore from backup with `./restore.sh --db-only [backup-file]`

## Performance Optimization

The backend is optimized for production with:

1. Redis caching for frequently accessed data
2. Database indexing for common queries
3. Connection pooling for database access
4. PM2 process management with automatic restarts

## Security Considerations

- **API Keys**: Protected in `.env` file, never exposed in code
- **JWT Tokens**: Used for secure authentication
- **Database**: Access restricted to localhost only
- **CORS**: Strict CORS configuration to prevent unauthorized access
- **Routes Protection**: Admin routes require authentication