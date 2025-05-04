#!/bin/bash

# Exit on error
set -e

echo "=== Starting Storefront in Development Mode with PM2 ==="

# Change directory to storefront
cd /root/damneddesigns/storefront

# Modify ecosystem.config.js to use development mode for storefront
echo "Creating custom PM2 config for storefront dev mode..."
cat > storefront-dev-ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: "damned-designs-storefront",
    cwd: "/root/damneddesigns/storefront",
    script: "npm",
    args: "run dev",
    env: {
      NODE_ENV: "development",
    },
    time: true,
    autorestart: true,
    max_restarts: 10,
    watch: false,
    instances: 1,
    exec_mode: "fork"
  }]
};
EOF

# Check if storefront is already running in PM2
if pm2 list | grep -q "damned-designs-storefront"; then
  echo "Stopping existing storefront instance..."
  pm2 stop damned-designs-storefront
  pm2 delete damned-designs-storefront
fi

# Start storefront in development mode
echo "Starting storefront in development mode with PM2..."
pm2 start storefront-dev-ecosystem.config.js

# Save PM2 configuration
echo "Saving PM2 configuration..."
pm2 save

echo "=== Setup Complete ==="
echo "Storefront is now running in development mode with PM2."
echo "It will be accessible at http://localhost:8000"
echo ""
echo "NOTE: This is a development mode workaround to bypass the publishable key build error."
echo "      For production use, you'll need to obtain a valid publishable key and use the"
echo "      regular start-pm2.sh script."