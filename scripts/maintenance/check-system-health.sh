#!/bin/bash
# Damned Designs System Health Check Script
# This script checks the health of all system components

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# Navigate to project root (3 levels up)
PROJECT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
LOG_FILE="$PROJECT_DIR/logs/health-check.log"

# Log function
log() {
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1"
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" >> "$LOG_FILE"
}

# Create log directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"

log "Starting system health check..."

# Check PM2 services
log "Checking PM2 services..."
PM2_STATUS=$(pm2 status | grep -E 'damned-designs-' | awk '{ print $2 " " $8 " " $10 }')
if [[ -z "$PM2_STATUS" ]]; then
  log "ERROR: No PM2 services found. Services may have crashed."
else
  log "PM2 services found:"
  echo "$PM2_STATUS"
  echo "$PM2_STATUS" >> "$LOG_FILE"
  
  # Check for any stopped services
  STOPPED_SERVICES=$(pm2 status | grep -E 'damned-designs-' | grep -v online | awk '{ print $2 }')
  if [[ ! -z "$STOPPED_SERVICES" ]]; then
    log "WARNING: The following services are not running:"
    echo "$STOPPED_SERVICES"
    echo "$STOPPED_SERVICES" >> "$LOG_FILE"
  else
    log "All services are running."
  fi
fi

# Check disk space
log "Checking disk space..."
DISK_USAGE=$(df -h / | grep -v Filesystem)
DISK_USAGE_PERCENT=$(echo "$DISK_USAGE" | awk '{ print $5 }' | sed 's/%//')
echo "Disk usage: $DISK_USAGE"
echo "Disk usage: $DISK_USAGE" >> "$LOG_FILE"

if [ "$DISK_USAGE_PERCENT" -gt 90 ]; then
  log "WARNING: Disk usage is over 90%. Consider freeing up space."
fi

# Check memory usage
log "Checking memory usage..."
MEM_USAGE=$(free -h | grep Mem)
echo "Memory usage: $MEM_USAGE"
echo "Memory usage: $MEM_USAGE" >> "$LOG_FILE"

# Check backend API
log "Checking backend API health..."
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9000/health)
if [ "$BACKEND_HEALTH" == "200" ]; then
  log "Backend API is healthy."
else
  log "WARNING: Backend API health check failed with status code: $BACKEND_HEALTH"
fi

# Check storefront
log "Checking storefront health..."
STOREFRONT_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000)
if [ "$STOREFRONT_HEALTH" == "200" ]; then
  log "Storefront is healthy."
else
  log "WARNING: Storefront health check failed with status code: $STOREFRONT_HEALTH"
fi

# Check admin
log "Checking admin panel health..."
ADMIN_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)
if [ "$ADMIN_HEALTH" == "200" ]; then
  log "Admin panel is healthy."
else
  log "WARNING: Admin panel health check failed with status code: $ADMIN_HEALTH"
fi

# Check images server
log "Checking images server health..."
IMAGES_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:6162)
if [ "$IMAGES_HEALTH" == "200" ]; then
  log "Images server is healthy."
else
  log "WARNING: Images server health check failed with status code: $IMAGES_HEALTH"
fi

# Check database
log "Checking database connection..."
DB_USER="myuser"
DB_PASSWORD="adrdsouza"
DB_NAME="medusa-medusaapp"

if PGPASSWORD="$DB_PASSWORD" psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1; then
  log "Database connection successful."
else
  log "ERROR: Database connection failed."
fi

log "System health check completed."
echo "===================================================="
echo "Health check completed at: $(date)"
echo "===================================================="