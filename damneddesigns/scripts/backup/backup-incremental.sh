#!/bin/bash
# Damned Designs Incremental Backup Script
# This script creates incremental backups using rsync for efficiency

# Configuration
BACKUP_DIR="/root/damneddesigns/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DAY_OF_WEEK=$(date +%u)  # 1-7 (Monday-Sunday)
DAY_OF_MONTH=$(date +%d)
WEEKNUMBER=$(date +%U)   # Week number (00-53)
MONTH=$(date +%m)
YEAR=$(date +%Y)
DB_USER="myuser"
DB_PASSWORD="adrdsouza"
DB_NAME="medusa-medusaapp"

# Main directories to backup
DIRECTORIES=(
  "/root/damneddesigns/backend"
  "/root/damneddesigns/storefront" 
  "/root/damneddesigns/admin"
  "/root/damneddesigns/images"
  "/root/damneddesigns/documentation"
)

# Configuration files to backup
CONFIG_FILES=(
  "/root/damneddesigns/ecosystem.config.js"
  "/etc/caddy/Caddyfile"
)

# Log function
log() {
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1"
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" >> "${BACKUP_DIR}/backup.log"
}

# Validate directories
mkdir -p "${BACKUP_DIR}/incremental/current"
mkdir -p "${BACKUP_DIR}/incremental/weekly"
mkdir -p "${BACKUP_DIR}/incremental/monthly"
mkdir -p "${BACKUP_DIR}/incremental/configs"
mkdir -p "${BACKUP_DIR}/db_backups/daily"
mkdir -p "${BACKUP_DIR}/db_backups/weekly"
mkdir -p "${BACKUP_DIR}/db_backups/monthly"

# Determine backup mode
FULL_BACKUP=0
if [ "${DAY_OF_WEEK}" = "7" ]; then
  FULL_BACKUP=1
  log "Weekly full backup day detected..."
elif [ "${DAY_OF_MONTH}" = "01" ]; then
  FULL_BACKUP=1
  log "Monthly full backup day detected..."
fi

log "Starting backup process for Damned Designs e-commerce system..."

# Step 1: Always back up the database (database backups are always full, never incremental)
log "Creating database backup..."
DB_BACKUP_FILE="${BACKUP_DIR}/db_backups/daily/medusa_db_${TIMESTAMP}.sql.gz"
PGPASSWORD=${DB_PASSWORD} pg_dump -h localhost -U ${DB_USER} ${DB_NAME} | gzip > "${DB_BACKUP_FILE}"

if [ $? -ne 0 ]; then
  log "ERROR: Database backup failed!"
  exit 1
fi

log "Database backup succeeded: ${DB_BACKUP_FILE}"

# Step 2: Backup key configuration files (configs are small, so always do full backups)
log "Backing up key configuration files..."
for CONFIG_FILE in "${CONFIG_FILES[@]}"; do
  if [ -f "$CONFIG_FILE" ]; then
    FILENAME=$(basename "$CONFIG_FILE")
    cp "$CONFIG_FILE" "${BACKUP_DIR}/incremental/configs/${FILENAME}"
    log "Backed up config: ${FILENAME}"
  else
    log "WARNING: Config file not found: ${CONFIG_FILE}"
  fi
done

# Copy environment files separately (they're in subdirectories)
cp -f /root/damneddesigns/backend/.env "${BACKUP_DIR}/incremental/configs/backend.env"
cp -f /root/damneddesigns/storefront/.env "${BACKUP_DIR}/incremental/configs/storefront.env"
cp -f /root/damneddesigns/admin/.env "${BACKUP_DIR}/incremental/configs/admin.env"

# Step 3: Backup main directories (incremental or full depending on day)
if [ $FULL_BACKUP -eq 1 ]; then
  # Full backup day (weekly or monthly)
  log "Performing FULL backup of all directories..."
  
  # Clear current directory for a fresh full backup
  rm -rf "${BACKUP_DIR}/incremental/current"
  mkdir -p "${BACKUP_DIR}/incremental/current"
  
  # Backup each directory
  for DIR in "${DIRECTORIES[@]}"; do
    if [ -d "$DIR" ]; then
      DIRNAME=$(basename "$DIR")
      log "Full backup of ${DIRNAME}..."
      rsync -a --delete "$DIR/" "${BACKUP_DIR}/incremental/current/${DIRNAME}/"
    else
      log "WARNING: Directory not found: ${DIR}"
    fi
  done
  
  # Create a dated snapshot of this full backup
  if [ "${DAY_OF_WEEK}" = "7" ]; then
    # Weekly backup
    SNAPSHOT_DIR="${BACKUP_DIR}/incremental/weekly/week${WEEKNUMBER}_${YEAR}"
    log "Creating weekly snapshot: ${SNAPSHOT_DIR}"
    rm -rf "$SNAPSHOT_DIR"
    cp -al "${BACKUP_DIR}/incremental/current" "$SNAPSHOT_DIR"
  fi
  
  if [ "${DAY_OF_MONTH}" = "01" ]; then
    # Monthly backup
    SNAPSHOT_DIR="${BACKUP_DIR}/incremental/monthly/${YEAR}_${MONTH}"
    log "Creating monthly snapshot: ${SNAPSHOT_DIR}"
    rm -rf "$SNAPSHOT_DIR"
    cp -al "${BACKUP_DIR}/incremental/current" "$SNAPSHOT_DIR"
  fi
else
  # Incremental backup day (normal day)
  log "Performing INCREMENTAL backup of all directories..."
  
  # Backup each directory incrementally
  for DIR in "${DIRECTORIES[@]}"; do
    if [ -d "$DIR" ]; then
      DIRNAME=$(basename "$DIR")
      DEST_DIR="${BACKUP_DIR}/incremental/current/${DIRNAME}"
      
      # Create directory if it doesn't exist (first run)
      if [ ! -d "$DEST_DIR" ]; then
        mkdir -p "$DEST_DIR"
        log "First backup of ${DIRNAME}, creating initial copy..."
        rsync -a "$DIR/" "$DEST_DIR/"
      else
        log "Incremental backup of ${DIRNAME}..."
        rsync -a --delete "$DIR/" "$DEST_DIR/"
      fi
    else
      log "WARNING: Directory not found: ${DIR}"
    fi
  done
fi

# Step 4: Create archive of database backup for weekly and monthly if needed
if [ "${DAY_OF_WEEK}" = "7" ]; then
  # Weekly DB backup
  cp "$DB_BACKUP_FILE" "${BACKUP_DIR}/db_backups/weekly/medusa_db_week${WEEKNUMBER}_${YEAR}.sql.gz"
  log "Created weekly database backup"
fi

if [ "${DAY_OF_MONTH}" = "01" ]; then
  # Monthly DB backup
  cp "$DB_BACKUP_FILE" "${BACKUP_DIR}/db_backups/monthly/medusa_db_${YEAR}_${MONTH}.sql.gz"
  log "Created monthly database backup"
fi

# Step 5: Clean up old backups
log "Cleaning up old backups..."

# Keep 7 daily database backups
find "${BACKUP_DIR}/db_backups/daily" -name "medusa_db_*.sql.gz" -type f -mtime +7 -delete

# Keep 5 weekly backups (5 weeks)
find "${BACKUP_DIR}/incremental/weekly" -maxdepth 1 -type d -name "week*" | sort | head -n -5 | xargs -r rm -rf
find "${BACKUP_DIR}/db_backups/weekly" -name "medusa_db_week*.sql.gz" -type f | sort | head -n -5 | xargs -r rm -f

# Keep 3 monthly backups
find "${BACKUP_DIR}/incremental/monthly" -maxdepth 1 -type d -name "[0-9]*_[0-9]*" | sort | head -n -3 | xargs -r rm -rf
find "${BACKUP_DIR}/db_backups/monthly" -name "medusa_db_[0-9]*_[0-9]*.sql.gz" -type f | sort | head -n -3 | xargs -r rm -f

# Step 6: Upload to Google Drive (if rclone is configured)
log "Starting Google Drive upload..."
if rclone ls gdrive:DamnedDesigns 2>/dev/null; then
  # Create directory structure if needed
  rclone mkdir gdrive:DamnedDesigns/backups/incremental
  rclone mkdir gdrive:DamnedDesigns/backups/incremental/weekly
  rclone mkdir gdrive:DamnedDesigns/backups/incremental/monthly
  rclone mkdir gdrive:DamnedDesigns/backups/db_backups
  rclone mkdir gdrive:DamnedDesigns/backups/db_backups/weekly
  rclone mkdir gdrive:DamnedDesigns/backups/db_backups/monthly
  
  # Upload latest database backup
  log "Uploading latest database backup..."
  rclone copy "$DB_BACKUP_FILE" gdrive:DamnedDesigns/backups/db_backups/daily
  
  # Upload weekly backup if created
  if [ "${DAY_OF_WEEK}" = "7" ]; then
    log "Uploading weekly backup files..."
    WEEKLY_DB="${BACKUP_DIR}/db_backups/weekly/medusa_db_week${WEEKNUMBER}_${YEAR}.sql.gz"
    rclone copy "$WEEKLY_DB" gdrive:DamnedDesigns/backups/db_backups/weekly
    
    # Only sync the whole weekly directory on full backup days
    if [ $FULL_BACKUP -eq 1 ]; then
      SNAPSHOT_DIR="${BACKUP_DIR}/incremental/weekly/week${WEEKNUMBER}_${YEAR}"
      log "Uploading weekly snapshot: ${SNAPSHOT_DIR}"
      rclone sync "$SNAPSHOT_DIR" "gdrive:DamnedDesigns/backups/incremental/weekly/week${WEEKNUMBER}_${YEAR}"
    fi
  fi
  
  # Upload monthly backup if created
  if [ "${DAY_OF_MONTH}" = "01" ]; then
    log "Uploading monthly backup files..."
    MONTHLY_DB="${BACKUP_DIR}/db_backups/monthly/medusa_db_${YEAR}_${MONTH}.sql.gz"
    rclone copy "$MONTHLY_DB" gdrive:DamnedDesigns/backups/db_backups/monthly
    
    # Only sync the whole monthly directory on full backup days
    if [ $FULL_BACKUP -eq 1 ]; then
      SNAPSHOT_DIR="${BACKUP_DIR}/incremental/monthly/${YEAR}_${MONTH}"
      log "Uploading monthly snapshot: ${SNAPSHOT_DIR}"
      rclone sync "$SNAPSHOT_DIR" "gdrive:DamnedDesigns/backups/incremental/monthly/${YEAR}_${MONTH}"
    fi
  fi
  
  # Upload config files (always upload these as they're small and critical)
  log "Uploading configuration files..."
  rclone sync "${BACKUP_DIR}/incremental/configs" gdrive:DamnedDesigns/backups/incremental/configs
  
  log "Google Drive upload completed successfully"
else
  log "WARNING: rclone not configured for Google Drive. Skipping upload."
  log "To configure rclone, run: rclone config"
fi

# Calculate backup sizes
DB_SIZE=$(du -sh "${BACKUP_DIR}/db_backups/daily" | cut -f1)
INCR_SIZE=$(du -sh "${BACKUP_DIR}/incremental/current" | cut -f1)
CONFIGS_SIZE=$(du -sh "${BACKUP_DIR}/incremental/configs" | cut -f1)

log "Backup process completed successfully."
echo "===================================================="
echo "Backup Sizes:"
echo "  Database backup: ${DB_SIZE}"
echo "  Incremental filesystem backup: ${INCR_SIZE}"
echo "  Configuration files: ${CONFIGS_SIZE}"
echo "===================================================="
echo "Backup saved to: ${BACKUP_DIR}/incremental/"
echo "Database backup: ${DB_BACKUP_FILE}"
echo "===================================================="