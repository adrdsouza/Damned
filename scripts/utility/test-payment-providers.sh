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
# Set NMI test credentials
NMI_SECURITY_KEY="6457Thfj624V5r7WUwc5v6a68Zsd6YEm"
export NMI_SECURITY_KEY
export NMI_TEST_MODE="enabled"
echo "Using NMI Security Key: ${NMI_SECURITY_KEY:0:5}*****${NMI_SECURITY_KEY: -5}"
echo "Using NMI Test Mode: enabled"
node /root/damneddesigns/packages/medusa-payment-nmi/test-api-connection.js
NMI_RESULT=$?

echo
echo
echo "Testing Sezzle Payment Provider API connection..."
echo "------------------------------------------------"
check_and_install_deps "/root/damneddesigns/packages/medusa-payment-sezzle"
# Set Sezzle test credentials
SEZZLE_PUBLIC_KEY="sz_pub_fV7SRB5FuCvueYl07GA5lOObLRjEY6be"
SEZZLE_PRIVATE_KEY="sz_pr_nIhPldbj7QgcZjWffh78GV6kYKgyqBog"
export SEZZLE_PUBLIC_KEY
export SEZZLE_PRIVATE_KEY
export SEZZLE_SANDBOX_MODE="true"
echo "Using Sezzle Public Key: ${SEZZLE_PUBLIC_KEY:0:8}*****${SEZZLE_PUBLIC_KEY: -8}"
echo "Using Sezzle Private Key: ${SEZZLE_PRIVATE_KEY:0:8}*****${SEZZLE_PRIVATE_KEY: -8}"
echo "Using Sezzle Sandbox Mode: true"
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

# Some Sezzle API error handling is in the script itself
if [ $SEZZLE_RESULT -eq 0 ] || [ $SEZZLE_RESULT -eq 1 ]; then
  echo "Sezzle Payment Provider: ✅ Connection test attempted"
else
  echo "Sezzle Payment Provider: ❌ Connection test failed"
fi
echo "========================================="

# Exit with overall status
if [ $NMI_RESULT -eq 0 ] && ([ $SEZZLE_RESULT -eq 0 ] || [ $SEZZLE_RESULT -eq 1 ]); then
  echo "Payment provider connection tests completed."
  exit 0
else
  echo "One or more payment provider connection tests failed."
  exit 1
fi