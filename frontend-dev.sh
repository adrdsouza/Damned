#!/bin/bash

# Exit on error
set -e

echo "=== Starting Frontend in Development Mode with PM2 ==="

# Change directory to frontend
cd /root/damneddesigns/frontend

# Modify ecosystem.config.js to use development mode for frontend
echo "Creating custom PM2 config for frontend dev mode..."
cat > frontend-dev-ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: "damned-designs-frontend",
    cwd: "/root/damneddesigns/frontend",
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

# Check if frontend is already running in PM2
if pm2 list | grep -q "damned-designs-frontend"; then
  echo "Stopping existing frontend instance..."
  pm2 stop damned-designs-frontend
  pm2 delete damned-designs-frontend
fi

# Start frontend in development mode
echo "Starting frontend in development mode with PM2..."
pm2 start frontend-dev-ecosystem.config.js

# Save PM2 configuration
echo "Saving PM2 configuration..."
pm2 save

echo "=== Setup Complete ==="
echo "Frontend is now running in development mode with PM2."
echo "It will be accessible at http://localhost:8000"
echo ""
echo "NOTE: This is a development mode workaround to bypass the publishable key build error."
echo "      For production use, you'll need to obtain a valid publishable key and use the"
echo "      regular start-pm2.sh script."