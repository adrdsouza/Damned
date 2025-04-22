#!/bin/bash
# test-nmi.sh - Verify NMI payment provider loads correctly with Medusa 2.6.1

set -e # Exit on error

echo "Starting NMI payment provider test..."

# First build the package
./build-nmi-advanced.sh

# Start the Medusa server in test mode
cd /root/damneddesigns/backend
NODE_ENV=test npm run start:server > server.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 10

# Check if the server started successfully
if grep -q "Unable to load resources for module" server.log; then
  echo "❌ Server failed to start with NMI provider"
  cat server.log
  kill $SERVER_PID
  exit 1
fi

if grep -q "moduleProviderServices is not iterable" server.log; then
  echo "❌ NMI provider failed to load: moduleProviderServices is not iterable"
  cat server.log
  kill $SERVER_PID
  exit 1
fi

if grep -q "Server is ready" server.log; then
  echo "✅ Server started successfully with NMI provider"
else
  echo "❌ Server failed to start properly"
  cat server.log
  kill $SERVER_PID
  exit 1
fi

# Test the payment provider endpoints
echo "Testing NMI payment provider endpoints..."
curl -s http://localhost:9000/store/payment-providers | grep -q "nmi" && echo "✅ NMI provider is available" || echo "❌ NMI provider not found"

# Test the payment provider initialization
echo "Testing NMI provider initialization..."
if grep -q "NMI payment provider initialized" server.log; then
  echo "✅ NMI provider initialized successfully"
else
  echo "❌ NMI provider initialization not found in logs"
  cat server.log
  kill $SERVER_PID
  exit 1
fi

# Test the admin payment provider endpoints
echo "Testing admin payment provider endpoints..."
curl -s http://localhost:9000/admin/payment-providers | grep -q "nmi" && echo "✅ NMI provider is available in admin API" || echo "❌ NMI provider not found in admin API"

# Clean up
kill $SERVER_PID
echo "Tests completed"