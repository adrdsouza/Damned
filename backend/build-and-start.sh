#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=== Starting Damned Designs Backend Build Process ==="

# Step 1: Build the Medusa application
echo "Building Medusa application..."
npm run build

# Step 2: Install dependencies in the server directory
echo "Installing server dependencies..."
cd .medusa/server && npm install

# Step 3: Copy environment variables
echo "Copying environment variables..."
cp ../../.env .env.production

# Step 4: Set production environment
echo "Setting NODE_ENV to production..."
export NODE_ENV=production

# Step 5: Start the server
echo "Starting Medusa server..."
npm run start

# Note: This script will not return as it keeps the server running
# To stop the server, press Ctrl+C