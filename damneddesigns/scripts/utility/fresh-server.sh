#!/bin/bash
set -e

# ---[ SETUP SCRIPT FOR A FRESH SERVER ]---
# This script will:
# 1. Install system dependencies (Node.js, npm, PM2, git, etc.)
# 2. Clone the repo if not already present
# 3. Run the main setup/reset script

# ---[ 1. Install system dependencies ]---
echo "Installing system dependencies (Node.js, npm, PM2, git, etc.)..."

# Update package list and install dependencies
sudo apt-get update
sudo apt-get install -y curl git build-essential

# Install Node.js (LTS) and npm if not present
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# Install PM2 globally if not present
if ! command -v pm2 &> /dev/null; then
  sudo npm install -g pm2
fi

# Install Caddy (if not present)
if ! command -v caddy &> /dev/null; then
  sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo apt-key add -
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
  sudo apt update
  sudo apt install caddy
fi

# Install PostgreSQL and Redis if not present
if ! command -v psql &> /dev/null; then
  sudo apt-get install -y postgresql postgresql-contrib
fi
if ! command -v redis-server &> /dev/null; then
  sudo apt-get install -y redis-server
fi

# ---[ 2. Clone the repo if not already present ]---
REPO_URL="git@github.com:yourusername/damneddesigns.git" # <-- CHANGE THIS TO YOUR REPO URL
TARGET_DIR="/root/damneddesigns"

if [ ! -d "$TARGET_DIR" ]; then
  echo "Cloning repository..."
  git clone "$REPO_URL" "$TARGET_DIR"
else
  echo "Repository already present at $TARGET_DIR."
fi

cd "$TARGET_DIR/scripts/utility"

# ---[ 3. Run the main setup/reset script ]---
chmod +x setup-or-reset-all.sh
./setup-or-reset-all.sh
