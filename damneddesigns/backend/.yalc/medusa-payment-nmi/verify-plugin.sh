#!/bin/bash

echo "Checking NMI plugin structure..."

# List of required files
required_files=(
  "src/index.js"
  "src/services/nmi-provider.js"
  "src/api/routes/hooks/index.js"
  ".babelrc"
  "package.json"
  ".env"
)

all_files_exist=true

# Check if all required files exist
for file in "${required_files[@]}"; do
  if [ -f "$file" ]; then
    echo "$file: OK"
  else
    echo "$file: MISSING"
    all_files_exist=false
  fi
done

echo ""

if [ "$all_files_exist" = true ]; then
  echo "All required files exist. Plugin structure is valid."
  
  # Check environment variables
  echo -e "\nEnvironment variables:"
  if grep -q "NMI_SECURITY_KEY" .env; then
    echo "- NMI_SECURITY_KEY: Set"
  else
    echo "- NMI_SECURITY_KEY: Not set"
  fi
  
  if grep -q "NMI_PUBLIC_KEY" .env; then
    echo "- NMI_PUBLIC_KEY: Set"
  else
    echo "- NMI_PUBLIC_KEY: Not set"
  fi
  
  echo -e "\nPlugin is ready for integration with a Medusa project."
  echo "To use this plugin in a Medusa project:"
  echo "1. Copy this directory to your Medusa project's node_modules/"
  echo "2. Add the plugin to your medusa-config.js"
  echo "3. Restart your Medusa server"
else
  echo "Some required files are missing. Please create them before proceeding."
fi