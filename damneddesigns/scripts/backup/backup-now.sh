#!/bin/bash
# Damned Designs On-Demand Backup Script
# Usage: ./backup-now.sh [--skip-drive] [--no-compress] [--db-only]

# Process command-line arguments
SKIP_DRIVE=0
NO_COMPRESS=0
DB_ONLY=0

for arg in "$@"; do
  case $arg in
    --skip-drive)
      SKIP_DRIVE=1
      ;;
    --no-compress)
      NO_COMPRESS=1
      ;;
    --db-only)
      DB_ONLY=1
      ;;
    --help)
      echo "Damned Designs On-Demand Backup Tool"
      echo ""
      echo "Usage: ./backup-now.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --skip-drive    Skip Google Drive upload"
      echo "  --no-compress   Skip compression (faster but larger)"
      echo "  --db-only       Backup only the database"
      echo "  --help          Show this help message"
      echo ""
      exit 0
      ;;
  esac
done

# Configuration
BACKUP_DIR="/root/damneddesigns/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="damneddesigns_ondemand_${TIMESTAMP}"
DB_BACKUP_FILE="medusa_db_${TIMESTAMP}.sql"
DB_USER="myuser"
DB_PASSWORD="adrdsouza"
DB_NAME="medusa-medusaapp"

# Log function
log() {
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1"
}

# Create backup directories if they don't exist
mkdir -p "${BACKUP_DIR}/temp/${TIMESTAMP}"
mkdir -p "${BACKUP_DIR}/ondemand"

log "Starting on-demand backup process..."

# Step 1: Backup PostgreSQL Database
log "Creating database backup..."
PGPASSWORD=${DB_PASSWORD} pg_dump -h localhost -U ${DB_USER} ${DB_NAME} > "${BACKUP_DIR}/temp/${TIMESTAMP}/${DB_BACKUP_FILE}"

if [ $? -ne 0 ]; then
  log "ERROR: Database backup failed!"
  exit 1
fi

# Step 2: Backup key configuration files (if not DB only)
if [ "$DB_ONLY" -eq 0 ]; then
  log "Backing up key configuration files..."
  cp -r /root/damneddesigns/backend/.env "${BACKUP_DIR}/temp/${TIMESTAMP}/backend.env"
  cp -r /root/damneddesigns/storefront/.env "${BACKUP_DIR}/temp/${TIMESTAMP}/storefront.env"
  cp -r /root/damneddesigns/admin/.env "${BACKUP_DIR}/temp/${TIMESTAMP}/admin.env"
  cp -r /root/damneddesigns/ecosystem.config.js "${BACKUP_DIR}/temp/${TIMESTAMP}/"
  cp -r /etc/caddy/Caddyfile "${BACKUP_DIR}/temp/${TIMESTAMP}/"
  cp -r /root/damneddesigns/documentation "${BACKUP_DIR}/temp/${TIMESTAMP}/documentation"
else
  log "Skipping config files (--db-only option specified)..."
fi

# Step 3: Create the output file
if [ "$NO_COMPRESS" -eq 0 ]; then
  log "Creating compressed backup archive..."
  tar -czvf "${BACKUP_DIR}/ondemand/${BACKUP_NAME}.tar.gz" -C "${BACKUP_DIR}/temp" "${TIMESTAMP}"
  FINAL_FILE="${BACKUP_DIR}/ondemand/${BACKUP_NAME}.tar.gz"
else
  log "Creating uncompressed backup archive (--no-compress option specified)..."
  tar -cvf "${BACKUP_DIR}/ondemand/${BACKUP_NAME}.tar" -C "${BACKUP_DIR}/temp" "${TIMESTAMP}"
  FINAL_FILE="${BACKUP_DIR}/ondemand/${BACKUP_NAME}.tar"
fi

if [ $? -ne 0 ]; then
  log "ERROR: Failed to create backup archive!"
  exit 1
fi

# Step 4: Remove temporary files
log "Cleaning up temporary files..."
rm -rf "${BACKUP_DIR}/temp"

# Step 5: Upload to Google Drive (if requested and configured)
if [ "$SKIP_DRIVE" -eq 0 ]; then
  log "Checking Google Drive configuration..."
  if rclone ls gdrive:DamnedDesigns 2>/dev/null; then
    log "Uploading backup to Google Drive..."
    rclone copy "${FINAL_FILE}" gdrive:DamnedDesigns/backups/ondemand
    
    if [ $? -eq 0 ]; then
      log "Backup successfully uploaded to Google Drive"
    else
      log "ERROR: Failed to upload to Google Drive"
    fi
  else
    log "WARNING: rclone not configured for Google Drive. Skipping upload."
    log "To configure rclone, run: rclone config"
    log "Then create a remote named 'gdrive' pointing to your Google Drive"
  fi
else
  log "Skipping Google Drive upload (--skip-drive option specified)..."
fi

log "On-demand backup process completed successfully."
echo "===================================================="
echo "Backup saved to: ${FINAL_FILE}"
echo "Backup size:"
du -sh "${FINAL_FILE}"
echo "===================================================="