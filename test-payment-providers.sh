#!/bin/bash
# test-payment-providers.sh - Test connectivity to payment provider APIs

set -e # Exit on error

echo "==========================================="
echo "PAYMENT PROVIDER API CONNECTION TEST SCRIPT"
echo "==========================================="
echo 

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Install dependencies if needed
check_and_install_deps() {
  local package_dir=$1
  echo "Checking dependencies in $package_dir..."
  
  if ! grep -q '"axios"' "$package_dir/package.json" || ! grep -q '"dotenv"' "$package_dir/package.json"; then
    echo "Installing required dependencies in $package_dir..."
    (cd "$package_dir" && npm install --no-save axios dotenv)
  else
    echo "Required dependencies already installed."
  fi
}

# Test NMI payment provider
echo
echo "Testing NMI Payment Provider API connection..."
echo "---------------------------------------------"
check_and_install_deps "/root/damneddesigns/packages/medusa-payment-nmi"
node /root/damneddesigns/packages/medusa-payment-nmi/test-api-connection.js
NMI_RESULT=$?

echo
echo
echo "Testing Sezzle Payment Provider API connection..."
echo "------------------------------------------------"
check_and_install_deps "/root/damneddesigns/packages/medusa-payment-sezzle"
node /root/damneddesigns/packages/medusa-payment-sezzle/test-api-connection.js
SEZZLE_RESULT=$?

echo
echo "========================================="
echo "          CONNECTION TEST RESULTS        "
echo "========================================="
if [ $NMI_RESULT -eq 0 ]; then
  echo "NMI Payment Provider:    ✅ Connection test completed"
else
  echo "NMI Payment Provider:    ❌ Connection test failed"
fi

if [ $SEZZLE_RESULT -eq 0 ]; then
  echo "Sezzle Payment Provider: ✅ Connection test completed"
else
  echo "Sezzle Payment Provider: ❌ Connection test failed"
fi
echo "========================================="

# Exit with overall status
if [ $NMI_RESULT -eq 0 ] && [ $SEZZLE_RESULT -eq 0 ]; then
  echo "All payment provider connection tests completed successfully."
  exit 0
else
  echo "One or more payment provider connection tests failed."
  exit 1
fi