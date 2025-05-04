#!/bin/bash
# Damned Designs Backup Script
# This script creates comprehensive backups of the e-commerce system and uploads to Google Drive

# Configuration
BACKUP_DIR="/root/damneddesigns/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DAY_OF_WEEK=$(date +%u)  # 1-7 (Monday-Sunday)
DAY_OF_MONTH=$(date +%d)
BACKUP_FILE="damneddesigns_backup_${TIMESTAMP}.tar.gz"
DB_BACKUP_FILE="medusa_db_${TIMESTAMP}.sql"
DB_USER="myuser"
DB_PASSWORD="adrdsouza"
DB_NAME="medusa-medusaapp"

# Log function
log() {
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1"
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" >> "/root/damneddesigns/logs/backup.log"
}

# Create backup directories if they don't exist
mkdir -p "${BACKUP_DIR}/temp/${TIMESTAMP}"
mkdir -p "${BACKUP_DIR}/daily"
mkdir -p "${BACKUP_DIR}/weekly"
mkdir -p "${BACKUP_DIR}/monthly"

log "Starting backup process for Damned Designs e-commerce system..."

# Step 1: Backup PostgreSQL Database
log "Creating database backup..."
PGPASSWORD=${DB_PASSWORD} pg_dump -h localhost -U ${DB_USER} ${DB_NAME} > "${BACKUP_DIR}/temp/${TIMESTAMP}/${DB_BACKUP_FILE}"

if [ $? -ne 0 ]; then
  log "ERROR: Database backup failed!"
  exit 1
fi

# Step 2: Backup key configuration files
log "Backing up key configuration files..."
cp -r /root/damneddesigns/backend/.env "${BACKUP_DIR}/temp/${TIMESTAMP}/backend.env"
cp -r /root/damneddesigns/storefront/.env "${BACKUP_DIR}/temp/${TIMESTAMP}/storefront.env"
cp -r /root/damneddesigns/admin/.env "${BACKUP_DIR}/temp/${TIMESTAMP}/admin.env"
cp -r /root/damneddesigns/ecosystem.config.js "${BACKUP_DIR}/temp/${TIMESTAMP}/"
cp -r /etc/caddy/Caddyfile "${BACKUP_DIR}/temp/${TIMESTAMP}/"
cp -r /root/damneddesigns/documentation "${BACKUP_DIR}/temp/${TIMESTAMP}/documentation"

# Step 3: Create a compressed archive
log "Creating compressed backup archive..."
tar -czvf "${BACKUP_DIR}/${BACKUP_FILE}" -C "${BACKUP_DIR}/temp" "${TIMESTAMP}"

if [ $? -ne 0 ]; then
  log "ERROR: Failed to create backup archive!"
  exit 1
fi

# Step 4: Remove temporary files
log "Cleaning up temporary files..."
rm -rf "${BACKUP_DIR}/temp"

# Step 5: Implement backup rotation
# Always make a daily backup
cp "${BACKUP_DIR}/${BACKUP_FILE}" "${BACKUP_DIR}/daily/damneddesigns_daily.tar.gz"

# Weekly backup (on Sundays, day 7)
if [ "${DAY_OF_WEEK}" = "7" ]; then
  log "Creating weekly backup..."
  cp "${BACKUP_DIR}/${BACKUP_FILE}" "${BACKUP_DIR}/weekly/damneddesigns_weekly_${DAY_OF_WEEK}.tar.gz"
fi

# Monthly backup (on the 1st of each month)
if [ "${DAY_OF_MONTH}" = "01" ]; then
  log "Creating monthly backup..."
  MONTH=$(date +%m)
  cp "${BACKUP_DIR}/${BACKUP_FILE}" "${BACKUP_DIR}/monthly/damneddesigns_monthly_${MONTH}.tar.gz"
fi

# Step 6: Upload to Google Drive (if rclone is configured)
log "Uploading backup to Google Drive..."
if rclone ls gdrive:DamnedDesigns 2>/dev/null; then
  # Upload the current backup
  rclone copy "${BACKUP_DIR}/${BACKUP_FILE}" gdrive:DamnedDesigns/backups

  # Also update the daily/weekly/monthly backups
  rclone sync "${BACKUP_DIR}/daily" gdrive:DamnedDesigns/backups/daily
  rclone sync "${BACKUP_DIR}/weekly" gdrive:DamnedDesigns/backups/weekly
  rclone sync "${BACKUP_DIR}/monthly" gdrive:DamnedDesigns/backups/monthly
  
  log "Backup successfully uploaded to Google Drive"
else
  log "WARNING: rclone not configured for Google Drive. Skipping upload."
  log "To configure rclone, run: rclone config"
  log "Then create a remote named 'gdrive' pointing to your Google Drive"
fi

# Step 7: Clean up old backups (keep only last 7 days worth)
log "Cleaning up old backups..."
find "${BACKUP_DIR}" -name "damneddesigns_backup_*.tar.gz" -type f -mtime +7 -delete

log "Backup process completed successfully."
echo "===================================================="
echo "Backup saved to: ${BACKUP_DIR}/${BACKUP_FILE}"
echo "Backup sizes:"
du -sh "${BACKUP_DIR}/${BACKUP_FILE}"
echo "===================================================="