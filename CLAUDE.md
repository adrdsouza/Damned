# Damned Designs System Reference for Claude

This document contains critical information about the Damned Designs e-commerce platform.

## System Architecture & Status

- **Backend**: Medusa.js v2.7.1 running on Node.js 20+
- **Storefront**: Next.js 15.0.3 at port 8000 (using @medusajs/js-sdk latest version)
- **Admin Panel**: Medusa Dashboard v2.7.0 (Vite/React) running at port 5173
- **Images Server**: Custom service at port 6162
- **Database**: PostgreSQL
- **Process Management**: PM2
- **Web Server**: Caddy (reverse proxy)

### Payment Providers
- **NMI Payment Gateway**: Credit card processing
  - Currently in **TEST MODE** with key: `6457Thfj624V5r7WUwc5v6a68Zsd6YEm`
  - Production key available: `h3WD8p6Hc8WM4eEAqpb6fsTJMYp45Mrp`
  
- **Sezzle Payment Gateway**: Buy now, pay later
  - Using virtual card API approach
  - Currently in **SANDBOX MODE** with these credentials:
    - Public key: `sz_pub_fV7SRB5FuCvueYl07GA5lOObLRjEY6be`
    - Private key: `sz_pr_nIhPldbj7QgcZjWffh78GV6kYKgyqBog`
  - Production credentials in backend `.env.production`:
    - Public key: `sz_pub_mHYs860HGQAamnTUWOMfmOOsISn9slaT`
    - Private key: `sz_pr_SSKy28nqlOAd5ujZu9w8jEHCvGJ78fBR`

### Test Card Information
- **NMI Test Cards**:
  - Success: 4111111111111111
  - Decline: 4111111111111112
  
- **Sezzle Test Cards**:
  - Visa: 4242424242424242
  - Mastercard: 5555555555554444
  - Test OTP: 123123

## Services Overview

| Service | PM2 Name | Port | URL | Notes |
|---------|----------|------|-----|-------|
| Backend | damned-designs-backend | 9000 | https://api.damneddesigns.com | Core e-commerce engine v2.7.1 |
| Storefront | damned-designs-storefront | 8000 | https://damneddesigns.com | Next.js 15.3.1 customer-facing store |
| Admin | damned-designs-admin | 5173 | https://admin.damneddesigns.com | Admin dashboard |
| Images Server | damned-designs-images | 6162 | https://images.damneddesigns.com | Image hosting |

## Important URLs & Access

- **Main Store**: https://damneddesigns.com
- **Admin Dashboard**: https://admin.damneddesigns.com
- **API**: https://api.damneddesigns.com
- **Images**: https://images.damneddesigns.com

## Common Commands

```bash
# View all services
pm2 list

# Check logs for specific service
pm2 logs damned-designs-admin

# Restart specific service
pm2 restart damned-designs-admin

# Restart all services
pm2 restart all

# Always save config after changes
pm2 save
```

## Documentation

- **Payment Providers**: 
  - NMI: `/documentation/NMI.md`
  - Sezzle: `/documentation/Sezzle.md`
- **System Overview**: `/documentation/system-overview.md`
- **Backup System**: `/documentation/BACKUP.md`

## PM2 Configuration Reference

Located at `/root/damneddesigns/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: "damned-designs-backend",
      cwd: "/root/damneddesigns/backend/.medusa/server",
      script: "npm",
      args: "run start",
    },
    {
      name: "damned-designs-storefront",
      cwd: "/root/damneddesigns/storefront",
      script: "npm",
      args: "run start",
    },
    {
      name: "damned-designs-admin",
      cwd: "/root/damneddesigns/admin",
      script: "npm",
      args: "run preview",
    },
    {
      name: "damned-designs-images",
      cwd: "/root/damneddesigns/images/images",
      script: "node",
      args: "index.js",
    }
  ]
};
```

## Future Tasks

1. Test both payment methods in checkout flow
2. Switch to production mode when ready:
   - NMI: Set `NMI_TEST_MODE=disabled` in `.env`
   - Sezzle: Set `SEZZLE_SANDBOX_MODE=false` in `.env`

## Common Issues & Fixes

### Cart/Checkout Issues
- **"column i1.is_giftcard does not exist" Error**:
  - **Problem**: Database schema mismatch with Medusa 2.7.1 expectations
  - **Solution**: Add the missing column to the database:
    ```sql
    ALTER TABLE cart_line_item ADD COLUMN is_giftcard BOOLEAN NOT NULL DEFAULT FALSE;
    ```
  - After adding the column, restart services:
    ```bash
    pm2 restart damned-designs-backend damned-designs-storefront
    pm2 save
    ```

- **Payment Method Update**:
  - **Change**: The custom COD (Cash on Delivery) payment method has been replaced with Medusa's built-in manual payment method
  - **Current Configuration**: The system uses Medusa's standard manual payment provider (`pp_system_default`)
  - **Implementation**: The payment button component handles this method:
    ```
    /root/damneddesigns/storefront/src/modules/checkout/components/payment-button/index.tsx
    ```
  - After any modifications, restart the storefront:
    ```bash
    pm2 restart damned-designs-storefront
    pm2 save
    ```
  - Detailed documentation is available in `/documentation/COD.md`

### Server Component Errors
- **500 errors on Product Pages**:
  - **Problem**: Static generation issues with dynamic data
  - **Solution**: Force dynamic rendering by adding to product page file:
    ```javascript
    // In /storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx
    export const dynamic = 'force-dynamic'
    ```