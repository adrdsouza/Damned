#!/bin/bash
# rebuild-and-restart.sh
# This script rebuilds the Medusa backend and restarts the server
# to ensure new subscribers are properly loaded.

set -e

echo "🔄 Rebuilding and restarting Medusa backend..."

# Navigate to backend directory
cd /root/damneddesigns/packages/medusa-payment-nmi
npm install
npm run build
yalc publish

cd /root/damneddesigns/packages/medusa-payment-sezzle
npm install
npm run build
yalc publish

cd /root/damneddesigns/backend
yalc add medusa-payment-nmi
yalc add medusa-payment-sezzle

# Install any new dependencies (just in case)
echo "📦 Installing dependencies..."
npm install

# Rebuild the backend
echo "🔨 Rebuilding the backend..."
npm run build

# Restart the server using PM2
echo "🚀 Restarting the server..."
pm2 restart backend

# Wait for the server to start up
echo "⏳ Waiting for the server to start up..."
sleep 5

# Check if the server is running
if pm2 info backend | grep -q "online"; then
  echo "✅ Server restarted successfully!"
else
  echo "❌ There was a problem restarting the server. Check PM2 logs."
  exit 1
fi

echo "✨ Done! New email subscribers should now be active."
echo "📧 Run 'node test-all-email-templates.js' to test the email templates."