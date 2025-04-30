# Damned Designs System Reference for Claude

This document contains critical information about the Damned Designs e-commerce platform, including installation, configuration, and maintenance instructions.

## System Architecture & Status

- **Backend**: Medusa.js v2.7.1 running on Node.js 20+
- **Storefront**: Next.js 15.0.3 at port 8000 (using @medusajs/js-sdk latest version)
- **Admin Panel**: Medusa Dashboard v2.7.0 (Vite/React) running at port 5173
- **Images Server**: Custom service at port 6162
- **Database**: PostgreSQL (user: myuser, password: adrdsouza, database: medusa-medusaapp)
- **Process Management**: PM2
- **Web Server**: Caddy (reverse proxy)
- **Server IP**: 172.245.105.195

### Payment Providers
- **NMI Payment Gateway**: Credit card processing
  - Currently in **PRODUCTION MODE** with key: `h3WD8p6Hc8WM4eEAqpb6fsTJMYp45Mrp`
  - Test key available: `6457Thfj624V5r7WUwc5v6a68Zsd6YEm`
  
- **Sezzle Payment Gateway**: Buy now, pay later
  - Using virtual card API approach
  - Currently in **PRODUCTION MODE** with these credentials:
    - Public key: `sz_pub_mHYs860HGQAamnTUWOMfmOOsISn9slaT`
    - Private key: `sz_pr_SSKy28nqlOAd5ujZu9w8jEHCvGJ78fBR`
  - Sandbox credentials available:
    - Public key: `sz_pub_fV7SRB5FuCvueYl07GA5lOObLRjEY6be`
    - Private key: `sz_pr_nIhPldbj7QgcZjWffh78GV6kYKgyqBog`

### Test Card Information
- **NMI Test Cards** (use only when NMI is in test mode):
  - Success: 4111111111111111
  - Decline: 4111111111111112
  - Mastercard (Success): 5431111111111111
  - Mastercard (Decline): 5431111111111112
  
- **Sezzle Test Cards** (use only when Sezzle is in sandbox mode):
  - Visa: 4242424242424242
  - Mastercard: 5555555555554444
  - Amex: 371449635398431
  - Test OTP: 123123

## Services Overview

| Service | PM2 Name | Port | URL | Notes |
|---------|----------|------|-----|-------|
| Backend | damned-designs-backend | 9000 | https://api.damneddesigns.com | Core e-commerce engine v2.7.1 |
| Storefront | damned-designs-storefront | 8000 | https://damneddesigns.com | Next.js 15.0.3 customer-facing store |
| Admin | damned-designs-admin | 5173 | https://admin.damneddesigns.com | Admin dashboard |
| Images Server | damned-designs-images | 6162 | https://images.damneddesigns.com | Image hosting |

## Important URLs & Access

- **Main Store**: https://damneddesigns.com
- **Admin Dashboard**: https://admin.damneddesigns.com
- **API**: https://api.damneddesigns.com
- **Images**: https://images.damneddesigns.com

## Directory Structure

- **/root/damneddesigns/** - Main project directory
  - **/admin/** - Admin dashboard (Medusa Dashboard v2.7.0)
  - **/backend/** - Medusa.js server
  - **/storefront/** - Next.js customer-facing store
  - **/images/** - Custom image hosting service
  - **/packages/** - Custom Medusa plugins, including payment providers
  - **/documentation/** - Detailed documentation files
  - **/backups/** - System backups

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

# Monitor PM2 resources in real-time
pm2 monit

# View server status
systemctl status caddy
```

## Documentation

- **Payment Providers**: 
  - NMI: `/documentation/NMI.md`
  - Sezzle: `/documentation/Sezzle.md`
  - Manual Payment: `/documentation/COD.md`
- **System Overview**: `/documentation/system-overview.md`
- **Backup System**: `/documentation/BACKUP.md`
- **Storefront**: `/documentation/STOREFRONT.md`
- **Admin Panel**: `/documentation/ADMIN.md`
- **SMTP Configuration**: `/documentation/SMTP.md`

## PM2 Configuration Reference

Located at `/root/damneddesigns/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      // Backend Medusa Server
      name: "damned-designs-backend",
      cwd: "/root/damneddesigns/backend/.medusa/server",
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
      // Storefront Next.js Server (Production Mode)
      name: "damned-designs-storefront",
      cwd: "/root/damneddesigns/storefront",
      script: "npm",
      args: "run start",
      env: {
        HOST: "0.0.0.0"
      },    
      time: true,
      autorestart: true,
      max_restarts: 10,
      watch: false,
      instances: 1,
      exec_mode: "fork"
    },
    {
      // Admin Panel - Production Mode
      name: "damned-designs-admin",
      cwd: "/root/damneddesigns/admin",
      script: "npm",
      args: "run preview",
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
      name: "damned-designs-images",
      cwd: "/root/damneddesigns/images/images",
      script: "node",
      args: "index.js",
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

## Web Server Configuration (Caddy)

The Caddy configuration file is located at `/etc/caddy/Caddyfile`:

```
damneddesigns.com {
    reverse_proxy 127.0.0.1:8000
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

## Environment Files

### Backend (.env)

Key settings in `/root/damneddesigns/backend/.env`:

```
STORE_CORS=http://localhost:8000,https://docs.medusajs.com,https://damneddesigns.com,https://api.damneddesigns.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com,https://damneddesigns.com,https://admin.damneddesigns.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com,https://damneddesigns.com,https://admin.damneddesigns.com,https://api.damneddesigns.com
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgres://myuser:adrdsouza@localhost/medusa-medusaapp
SERVER_LINK=https://api.damneddesigns.com
IMAGE_SERVER_URL=https://images.damneddesigns.com

# NMI Payment Plugin Configuration
NMI_SECURITY_KEY=h3WD8p6Hc8WM4eEAqpb6fsTJMYp45Mrp

# Sezzle Payment Plugin Configuration
SEZZLE_PUBLIC_KEY=sz_pub_mHYs860HGQAamnTUWOMfmOOsISn9slaT
SEZZLE_PRIVATE_KEY=sz_pr_SSKy28nqlOAd5ujZu9w8jEHCvGJ78fBR
SEZZLE_SANDBOX_MODE=false
SEZZLE_CAPTURE_MODE=automatic
```

### Storefront (.env)

Key settings in `/root/damneddesigns/storefront/.env`:

```
MEDUSA_BACKEND_URL=https://api.damneddesigns.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_4a68e1bd85e72212ebbe8364d329891e7bdabcc921912541f37078fcfe197bfe
NEXT_PUBLIC_BASE_URL=https://damneddesigns.com
NEXT_PUBLIC_DEFAULT_REGION=us
```

### Admin Panel (.env)

Key settings in `/root/damneddesigns/admin/.env`:

```
VITE_MEDUSA_BACKEND_URL="https://admin.damneddesigns.com/api"
VITE_MEDUSA_STOREFRONT_URL="https://damneddesigns.com"
```

## System Installation/Reinstallation Guide

### Prerequisites

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

### Database Setup

```bash
# Create database user
sudo -u postgres psql -c "CREATE USER myuser WITH PASSWORD 'adrdsouza';"

# Create database
sudo -u postgres psql -c "CREATE DATABASE \"medusa-medusaapp\" OWNER myuser;"

# Verify connection
psql -U myuser -d medusa-medusaapp -h localhost
```

### DNS Configuration

Set up DNS A records for all domains to point to your server IP:
- damneddesigns.com → 172.245.105.195
- admin.damneddesigns.com → 172.245.105.195
- api.damneddesigns.com → 172.245.105.195
- images.damneddesigns.com → 172.245.105.195

### Restore from Backup

The easiest way to reinstall the system is to restore from a backup:

```bash
# List available backups
/root/damneddesigns/restore-project.sh --list

# Restore from a project backup
/root/damneddesigns/restore-project.sh --file damneddesigns_project_backup_20250423_123456.tar.gz

# Restore database from backup
# (Replace with the actual database backup file)
psql -U myuser -d medusa-medusaapp < /path/to/database_backup.sql
```

### Manual Installation (If No Backup Available)

1. **Clone the repository** (if applicable)
   ```bash
   git clone https://your-repo-url.git /root/damneddesigns
   ```

2. **Set up Caddy configuration**
   ```bash
   # Create/update Caddyfile
   nano /etc/caddy/Caddyfile
   # (Copy the Caddy configuration provided above)
   
   # Restart Caddy
   systemctl restart caddy
   ```

3. **Set up environment files**
   Create the necessary .env files in:
   - /root/damneddesigns/backend/.env
   - /root/damneddesigns/storefront/.env
   - /root/damneddesigns/admin/.env

4. **Start all services using the provided script**
   ```bash
   cd /root/damneddesigns
   ./start-pm2.sh
   ```

## Backup and Recovery

The system includes comprehensive backup scripts:

### Creating Backups

```bash
# Create a standard backup
/root/damneddesigns/backup-project.sh

# Create an incremental backup
/root/damneddesigns/backup-incremental.sh

# Create a database backup only
pg_dump -U myuser -d medusa-medusaapp > backup_$(date +%Y%m%d).sql
```

### Restoring from Backups

```bash
# List available backups
/root/damneddesigns/restore-project.sh --list

# Restore from a project backup
/root/damneddesigns/restore-project.sh --file BACKUP_FILENAME

# Restore from Google Drive backup (if configured)
/root/damneddesigns/restore-project.sh --from-drive BACKUP_FILENAME
```

For complete details on the backup system, see `/documentation/BACKUP.md`.

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
  - Implementation defined in `/storefront/src/lib/constants.tsx` with the `isManual()` function

### Server Component Errors
- **500 errors on Product Pages**:
  - **Problem**: Static generation issues with dynamic data
  - **Solution**: Force dynamic rendering by adding to product page file:
    ```javascript
    // In /storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx
    export const dynamic = 'force-dynamic'
    ```

### Connection Refused Errors
- **Caddy Connection Issues**:
  1. Check that all services are running: `pm2 list`
  2. Verify services are listening on correct ports: `ss -tlnp | grep -E '8000|9000|5173|6162'`
  3. Make sure Caddyfile uses `127.0.0.1` instead of `localhost` for all reverse proxies
  4. Restart affected services: `pm2 restart damned-designs-storefront`
  5. Restart Caddy: `systemctl restart caddy`
  6. Check Caddy logs: `journalctl -u caddy | tail -50`

## Maintenance Tasks

### Switching Payment Provider Modes

**NMI**:
- For production mode: Use key `h3WD8p6Hc8WM4eEAqpb6fsTJMYp45Mrp` in backend .env
- For test mode: Use key `6457Thfj624V5r7WUwc5v6a68Zsd6YEm` in backend .env

**Sezzle**:
- For production mode: Set `SEZZLE_SANDBOX_MODE=false` in backend .env
- For sandbox mode: Set `SEZZLE_SANDBOX_MODE=true` in backend .env

After changing any environment variables, restart the backend:
```bash
pm2 restart damned-designs-backend
pm2 save
```

### Database Maintenance

```bash
# Connect to database
psql -U myuser -d medusa-medusaapp

# Create a database backup
pg_dump -U myuser -d medusa-medusaapp > medusa_db_backup_$(date +%Y%m%d).sql

# Restore a database backup
psql -U myuser -d medusa-medusaapp < backup_file.sql
```

### Log Management

```bash
# View PM2 logs
pm2 logs

# View specific service logs
pm2 logs damned-designs-backend

# View Caddy logs
journalctl -u caddy

# Monitor system in real-time
pm2 monit
```

## Technical Support Contact Information

For technical support, contact:
- Primary: support@damneddesigns.com
- Secondary: admin@damneddesigns.com

For emergency issues related to the e-commerce platform, contact the system administrator directly.