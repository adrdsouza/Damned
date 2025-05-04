#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=== Starting All Damned Designs Services in PM2 ==="

# Step 1: Make sure backend is built correctly
echo "Building Medusa Backend..."
cd backend
npm run build
cd .medusa/server && npm install
cp ../../.env .env.production
cd ../../..

# Step 2: Start backend with PM2
echo "Starting backend with PM2..."
pm2 start ecosystem.config.js --only backend

# Step 3: Try to build and start the storefront
echo "Setting up storefront..."
cd storefront
if [ ! -f .env ]; then
  echo "Creating .env from template..."
  cp .env.template .env
  echo "Warning: You may need to update the publishable key in .env"
fi

# Check for publishable key
if grep -q "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=" .env && ! grep -q "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$" .env; then
  echo "Building and starting storefront..."
  npm run build && pm2 start ecosystem.config.js --only storefront
else
  echo "WARNING: Storefront not started due to missing publishable key."
  echo "Please update NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY in storefront/.env and run:"
  echo "cd storefront && npm run build && cd .. && pm2 start ecosystem.config.js --only storefront"
fi
cd ..

# Step 4: Start images server with PM2
echo "Starting images server with PM2..."
pm2 start ecosystem.config.js --only images

# Step 5: Build admin panel for static serving by Caddy
echo "Building admin panel for static serving via Caddy..."
cd admin
npm run build  # Build the admin panel for static output
cd ..
echo "Admin panel built successfully in /root/damneddesigns/admin/dist"
echo "Caddy will serve these files directly - no PM2 process needed"

# Step 6: Save the PM2 configuration
echo "Saving PM2 configuration..."
pm2 save

# Configure PM2 to start on system boot if not already configured
pm2 startup | grep -v "sudo" || true

echo "=== Setup Complete ==="
echo "Services are now running in PM2 and will persist even when terminal is closed."
echo ""
echo "PM2 Commands:"
echo "  pm2 list                     - View all running services"
echo "  pm2 logs                     - View all logs"
echo "  pm2 logs [service-name]      - View logs for specific service" 
echo "  pm2 monit                    - Monitor resources for all services"
echo "  pm2 restart [service-name]   - Restart a specific service"
echo "  pm2 restart all              - Restart all services"
echo ""
echo "Available Services:"
echo "  backend"
echo "  storefront"
echo "  images"
echo "  Note: Admin panel is now statically served by Caddy from /root/damneddesigns/admin/dist"