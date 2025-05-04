#!/bin/bash
# Damned Designs On-Demand Incremental Backup Script
# Usage: ./backup-incremental-now.sh [--db-only] [--skip-drive] [--full]

# Process command-line arguments
DB_ONLY=0
SKIP_DRIVE=0
FULL_BACKUP=0

for arg in "$@"; do
  case $arg in
    --db-only)
      DB_ONLY=1
      ;;
    --skip-drive)
      SKIP_DRIVE=1
      ;;
    --full)
      FULL_BACKUP=1
      ;;
    --help)
      echo "Damned Designs On-Demand Incremental Backup Tool"
      echo ""
      echo "Usage: ./backup-incremental-now.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --db-only       Backup only the database"
      echo "  --skip-drive    Skip Google Drive upload"
      echo "  --full          Force a full backup instead of incremental"
      echo "  --help          Show this help message"
      echo ""
      exit 0
      ;;
  esac
done

# Configuration
BACKUP_DIR="/root/damneddesigns/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
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
}

# Create backup directories if they don't exist
mkdir -p "${BACKUP_DIR}/incremental/current"
mkdir -p "${BACKUP_DIR}/incremental/ondemand"
mkdir -p "${BACKUP_DIR}/incremental/configs"
mkdir -p "${BACKUP_DIR}/db_backups/ondemand"

log "Starting on-demand backup process..."

# Step 1: Always back up the database
log "Creating database backup..."
DB_BACKUP_FILE="${BACKUP_DIR}/db_backups/ondemand/medusa_db_${TIMESTAMP}.sql.gz"
PGPASSWORD=${DB_PASSWORD} pg_dump -h localhost -U ${DB_USER} ${DB_NAME} | gzip > "${DB_BACKUP_FILE}"

if [ $? -ne 0 ]; then
  log "ERROR: Database backup failed!"
  exit 1
fi

log "Database backup succeeded: ${DB_BACKUP_FILE}"

# If db-only option is specified, skip the rest of the backup
if [ "$DB_ONLY" -eq 1 ]; then
  log "Skipping file backup (--db-only option specified)..."
else
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

  # Create a special on-demand backup directory for this backup
  ONDEMAND_DIR="${BACKUP_DIR}/incremental/ondemand/backup_${TIMESTAMP}"
  mkdir -p "$ONDEMAND_DIR"

  # Step 3: Backup main directories (incremental or full depending on option)
  if [ $FULL_BACKUP -eq 1 ]; then
    # Full backup requested
    log "Performing FULL backup of all directories..."
    
    # Backup each directory
    for DIR in "${DIRECTORIES[@]}"; do
      if [ -d "$DIR" ]; then
        DIRNAME=$(basename "$DIR")
        log "Full backup of ${DIRNAME}..."
        rsync -a "$DIR/" "${ONDEMAND_DIR}/${DIRNAME}/"
      else
        log "WARNING: Directory not found: ${DIR}"
      fi
    done
  else
    # Incremental backup based on current state
    log "Performing INCREMENTAL backup of all directories..."
    
    # Backup each directory incrementally
    for DIR in "${DIRECTORIES[@]}"; do
      if [ -d "$DIR" ]; then
        DIRNAME=$(basename "$DIR")
        SOURCE_DIR="${BACKUP_DIR}/incremental/current/${DIRNAME}"
        
        # Check if we have a current backup to base the increment on
        if [ -d "$SOURCE_DIR" ]; then
          log "Creating incremental backup of ${DIRNAME} based on current state..."
          
          # Create a hardlink copy of the current backup as the base
          mkdir -p "${ONDEMAND_DIR}/${DIRNAME}"
          cp -al "$SOURCE_DIR/." "${ONDEMAND_DIR}/${DIRNAME}/"
          
          # Apply changes
          rsync -a --delete "$DIR/" "${ONDEMAND_DIR}/${DIRNAME}/"
        else
          # No current backup exists, so just do a full backup
          log "No current backup found for ${DIRNAME}, creating full backup..."
          rsync -a "$DIR/" "${ONDEMAND_DIR}/${DIRNAME}/"
        fi
      else
        log "WARNING: Directory not found: ${DIR}"
      fi
    done
  fi

  # Copy the config files to the on-demand backup for completeness
  mkdir -p "${ONDEMAND_DIR}/configs"
  cp -r "${BACKUP_DIR}/incremental/configs/." "${ONDEMAND_DIR}/configs/"
fi

# Step 4: Upload to Google Drive (if configured and not skipped)
if [ "$SKIP_DRIVE" -eq 0 ]; then
  log "Checking Google Drive configuration..."
  if rclone ls gdrive:DamnedDesigns 2>/dev/null; then
    # Upload latest database backup
    log "Uploading database backup to Google Drive..."
    rclone copy "$DB_BACKUP_FILE" gdrive:DamnedDesigns/backups/db_backups/ondemand
    
    # If not db-only, upload the filesystem backup too
    if [ "$DB_ONLY" -eq 0 ]; then
      # Create necessary directories
      rclone mkdir gdrive:DamnedDesigns/backups/incremental/ondemand
      
      # Upload the ondemand backup
      log "Uploading filesystem backup to Google Drive..."
      rclone sync "$ONDEMAND_DIR" "gdrive:DamnedDesigns/backups/incremental/ondemand/backup_${TIMESTAMP}"
      
      # Upload config files
      log "Uploading configuration files..."
      rclone sync "${BACKUP_DIR}/incremental/configs" gdrive:DamnedDesigns/backups/incremental/configs
    fi
    
    log "Google Drive upload completed successfully"
  else
    log "WARNING: rclone not configured for Google Drive. Skipping upload."
    log "To configure rclone, run: rclone config"
  fi
else
  log "Skipping Google Drive upload (--skip-drive option specified)..."
fi

# Calculate backup sizes
DB_SIZE=$(du -sh "$DB_BACKUP_FILE" | cut -f1)

log "On-demand backup process completed successfully."
echo "===================================================="
echo "Backup Sizes:"
echo "  Database backup: ${DB_SIZE}"

if [ "$DB_ONLY" -eq 0 ]; then
  ONDEMAND_SIZE=$(du -sh "$ONDEMAND_DIR" | cut -f1)
  echo "  Filesystem backup: ${ONDEMAND_SIZE}"
  echo "Filesystem backup saved to: ${ONDEMAND_DIR}"
fi

echo "Database backup saved to: ${DB_BACKUP_FILE}"
echo "===================================================="