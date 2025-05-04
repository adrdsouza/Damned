#!/bin/bash
# Rebuilds the admin panel and restarts Caddy to serve the latest build
set -e

cd "$(dirname "$0")"
echo "Building admin panel for production..."
npm install
npm run build:preview
echo "Restarting Caddy server..."
sudo systemctl restart caddy
echo "Admin panel rebuilt and Caddy restarted."
