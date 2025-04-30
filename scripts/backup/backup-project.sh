#!/bin/bash
# Project backup script (excluding database) for Damned Designs

# Configuration
PROJECT_DIR="/root/damneddesigns"
BACKUP_DIR="${PROJECT_DIR}/backups/project"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="damneddesigns_project_backup_${TIMESTAMP}.tar.gz"

# Parse command line arguments
SKIP_DRIVE=0
HELP=0

for arg in "$@"
do
    case $arg in
        --skip-drive)
        SKIP_DRIVE=1
        shift
        ;;
        --help)
        HELP=1
        shift
        ;;
        *)
        # Unknown option
        ;;
    esac
done

if [ $HELP -eq 1 ]; then
    echo "Damned Designs Project Backup Tool (Database Excluded)"
    echo ""
    echo "Usage: ./backup-project.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --skip-drive  Create backup without uploading to Google Drive"
    echo "  --help        Show this help message"
    echo ""
    exit 0
fi

# Log function
log() {
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1"
}

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

log "Starting project backup (excluding database)..."

# Create temporary directory for files to include
mkdir -p "${PROJECT_DIR}/backup_temp"

# Copy all project files, excluding database files and temporary files
log "Copying project files (excluding database files)..."
rsync -a --exclude="*.sql" --exclude="*.sql.gz" --exclude="*.db" --exclude="*.sqlite" \
      --exclude="*/db" --exclude="*/data" --exclude="*/backup_temp" --exclude="*/backups" \
      --exclude="*/node_modules" --exclude="*/.git" \
      "${PROJECT_DIR}/" "${PROJECT_DIR}/backup_temp/"

# Create compressed archive
log "Creating compressed backup archive..."
tar -czf "${BACKUP_DIR}/${BACKUP_FILE}" -C "${PROJECT_DIR}/backup_temp" .

# Cleanup temporary directory
log "Cleaning up temporary files..."
rm -rf "${PROJECT_DIR}/backup_temp"

# Upload to Google Drive (if rclone is configured)
if [ $SKIP_DRIVE -eq 0 ]; then
  log "Uploading backup to Google Drive..."
  if rclone ls gdrive:DamnedDesigns 2>/dev/null; then
    # Create project backups directory if it doesn't exist
    rclone mkdir gdrive:DamnedDesigns/backups/project
    
    # Upload the current backup
    rclone copy "${BACKUP_DIR}/${BACKUP_FILE}" gdrive:DamnedDesigns/backups/project
    
    log "Backup successfully uploaded to Google Drive"
  else
    log "WARNING: rclone not configured for Google Drive. Skipping upload."
    log "To configure rclone, run: rclone config"
    log "Then create a remote named 'gdrive' pointing to your Google Drive"
  fi
fi

log "Backup process completed successfully."
echo "===================================================="
echo "Backup saved to: ${BACKUP_DIR}/${BACKUP_FILE}"
echo "Backup size:"
du -sh "${BACKUP_DIR}/${BACKUP_FILE}"
echo "===================================================="