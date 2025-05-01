# Damned Designs PM2 Guide

This document explains how to use PM2 to manage the Damned Designs services.

## What is PM2?

PM2 is a production process manager for Node.js applications that allows you to keep applications alive forever, reload them without downtime, and manage them easily. It provides:

- **Persistent services**: Keep services running after terminal/SSH disconnection
- **Auto-restart**: Automatically restart if services crash
- **Monitoring**: Built-in dashboard to monitor CPU/memory usage
- **Log management**: Centralized log handling with rotation
- **Load balancing**: Can run in cluster mode (not used in our setup)

## Services Setup

The Damned Designs project uses PM2 to manage three main services:

1. **Backend** (Medusa server)
2. **Storefront** (Next.js application)
3. **Images Server** (Image hosting service)

Note: The Admin Panel is now served directly by Caddy as static files from the `/root/damneddesigns/admin/dist` directory and doesn't require a PM2 process.

## Starting Services

A single script has been created to build and start all services with PM2:

```bash
cd /root/damneddesigns
chmod +x start-pm2.sh  # Only needed first time
./start-pm2.sh
```

This script:
- Builds the backend (Medusa)
- Builds the storefront (if environment variables are set)
- Starts all services with PM2
- Configures PM2 to save the current configuration

## PM2 Commands

Here are the most useful PM2 commands for managing your services:

### Viewing & Monitoring

```bash
# List all running processes
pm2 list

# View real-time monitoring dashboard
pm2 monit

# View logs for all services
pm2 logs

# View logs for a specific service
pm2 logs damned-designs-backend
```

### Managing Services

```bash
# Restart a specific service
pm2 restart damned-designs-backend

# Restart all services
pm2 restart all

# Stop a specific service
pm2 stop damned-designs-storefront

# Stop all services
pm2 stop all

# Remove a service from PM2
pm2 delete damned-designs-images

# Remove all services from PM2
pm2 delete all
```

### Startup on System Boot

To ensure services start automatically when the server reboots:

```bash
# Generate startup script (may require sudo)
pm2 startup

# Save the current PM2 configuration
pm2 save
```

## Troubleshooting

If a service is not working correctly:

1. Check the logs: `pm2 logs damned-designs-backend`
2. Verify status: `pm2 list`
3. Restart the service: `pm2 restart damned-designs-backend`
4. If needed, rebuild and restart the service using the start-pm2.sh script

## Storefront Notes

The storefront service requires a valid publishable key in the `.env` file. If you encounter build errors:

1. Edit the storefront environment file: `nano storefront/.env`
2. Update the `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` value
3. Restart the storefront: `pm2 restart damned-designs-storefront`

## Service Names Reference

- `damned-designs-backend` - Medusa backend server
- `damned-designs-storefront` - Next.js storefront
~~- `damned-designs-admin` - Admin dashboard~~ (Now served directly by Caddy as static files)
- `damned-designs-images` - Images server