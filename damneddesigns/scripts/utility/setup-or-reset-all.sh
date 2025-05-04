#!/bin/bash
set -e

cd /root/damneddesigns

# Step 1: Copy .env.template files to .env for all services
cp backend/.env.template backend/.env
cp storefront/.env.template storefront/.env
cp images/.env.template images/.env

echo "Copied .env.template files to .env."
echo "Please edit the .env files in backend, storefront, and images to add your real secrets and configuration."
echo "Press Enter to continue after editing the .env files, or Ctrl+C to abort."
read

# Step 2: Install dependencies and build all services
cd backend && npm install && npm run build && cd ..
cd storefront && npm install && npm run build && cd ..
cd images && npm install && cd ..

echo "Dependencies installed and builds complete."

# Step 3: Restart all services with PM2
pm2 restart all || pm2 start ecosystem.config.js && pm2 save

echo "All services rebuilt and restarted. Setup/reset complete."
