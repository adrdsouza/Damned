#!/bin/bash
# Damned Designs Production Deployment Script
# This script safely deploys code changes to production

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# Navigate to project root (3 levels up)
PROJECT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
LOG_FILE="$PROJECT_DIR/logs/deployment.log"

# Log function
log() {
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1"
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" >> "$LOG_FILE"
}

# Create log file if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"

log "Starting deployment to production..."

# Step 1: Run backup before making any changes
log "Creating backup before deployment..."
"$PROJECT_DIR/scripts/backup/backup-now.sh"
if [ $? -ne 0 ]; then
  log "ERROR: Backup failed. Aborting deployment."
  exit 1
fi
log "Backup completed successfully."

# Step 2: Pull latest changes from git
log "Pulling latest changes from git..."
cd "$PROJECT_DIR"
git pull
if [ $? -ne 0 ]; then
  log "ERROR: Git pull failed. Aborting deployment."
  exit 1
fi
log "Git pull completed successfully."

# Step 3: Stop services before updating
log "Stopping services..."
pm2 stop backend storefront damned-designs-admin images
if [ $? -ne 0 ]; then
  log "WARNING: Error stopping services. Continuing anyway..."
fi

# Step 4: Install dependencies
log "Installing backend dependencies..."
cd "$PROJECT_DIR/backend"
npm install
if [ $? -ne 0 ]; then
  log "ERROR: Backend dependencies installation failed. Aborting deployment."
  pm2 restart all
  exit 1
fi

log "Installing storefront dependencies..."
cd "$PROJECT_DIR/storefront"
npm install
if [ $? -ne 0 ]; then
  log "ERROR: Storefront dependencies installation failed. Aborting deployment."
  pm2 restart all
  exit 1
fi

log "Installing admin dependencies..."
cd "$PROJECT_DIR/admin"
npm install
if [ $? -ne 0 ]; then
  log "ERROR: Admin dependencies installation failed. Aborting deployment."
  pm2 restart all
  exit 1
fi

# Step 5: Build applications
log "Building backend..."
cd "$PROJECT_DIR/backend"
npm run build
if [ $? -ne 0 ]; then
  log "ERROR: Backend build failed. Aborting deployment."
  pm2 restart all
  exit 1
fi

log "Building storefront..."
cd "$PROJECT_DIR/storefront"
npm run build
if [ $? -ne 0 ]; then
  log "ERROR: Storefront build failed. Aborting deployment."
  pm2 restart all
  exit 1
fi

log "Building admin..."
cd "$PROJECT_DIR/admin"
npm run build
if [ $? -ne 0 ]; then
  log "ERROR: Admin build failed. Aborting deployment."
  pm2 restart all
  exit 1
fi

# Step 6: Restart services
log "Restarting services..."
pm2 restart backend storefront damned-designs-admin images
if [ $? -ne 0 ]; then
  log "ERROR: Failed to restart services. Manual intervention required."
  exit 1
fi

# Step 7: Save PM2 configuration
log "Saving PM2 configuration..."
pm2 save
if [ $? -ne 0 ]; then
  log "WARNING: Failed to save PM2 configuration."
fi

log "Deployment completed successfully."
echo "===================================================="
echo "Deployment completed at: $(date)"
echo "===================================================="