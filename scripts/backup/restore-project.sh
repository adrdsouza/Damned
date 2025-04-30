#!/bin/bash
# Project restore script (excluding database) for Damned Designs

# Configuration
PROJECT_DIR="/root/damneddesigns"
BACKUP_DIR="${PROJECT_DIR}/backups/project"

# Parse command line arguments
BACKUP_FILE=""
FROM_DRIVE=""
LIST=0
HELP=0

# Function to show usage
show_usage() {
  echo "Damned Designs Project Restore Tool (Database Excluded)"
  echo ""
  echo "Usage: ./restore-project.sh [OPTIONS]"
  echo ""
  echo "Options:"
  echo "  --file BACKUP_FILE      Restore from a local backup file"
  echo "  --from-drive BACKUP_NAME Download and restore from a backup on Google Drive"
  echo "  --list                  List available project backups (local and on Google Drive)"
  echo "  --help                  Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./restore-project.sh --list"
  echo "  ./restore-project.sh --file damneddesigns_project_backup_20250423_123456.tar.gz"
  echo "  ./restore-project.sh --from-drive damneddesigns_project_backup_20250423_123456.tar.gz"
  echo ""
}

# Function to list available backups
list_backups() {
  echo "=== Available Local Project Backups ==="
  echo ""
  find "${BACKUP_DIR}" -name "damneddesigns_project_backup_*.tar.gz" -type f | sort
  
  echo ""
  echo "=== Available Google Drive Project Backups ==="
  echo ""
  
  if rclone listremotes | grep -q "^gdrive:"; then
    # Remote exists, now check the path
    if rclone ls gdrive:DamnedDesigns/backups/ondemand 2>/dev/null; then
      # Listing successful, backups found or directory is empty
      echo "" # rclone ls output is already printed by the command itself
    else
      # rclone ls failed for the specific path
      echo "Error: Could not list backups in gdrive:DamnedDesigns/backups/ondemand."
      echo "Ensure the path exists and you have permissions."
    fi
  else
    # gdrive remote does not exist
    echo "Google Drive remote 'gdrive' not configured."
    echo "Run 'rclone config' to set up Google Drive access with the name 'gdrive'."
  fi
}

# Log function
log() {
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1"
}

# Function to restore from a backup file
restore_from_file() {
  local BACKUP_PATH=$1
  
  # Check if the backup file exists
  if [ ! -f "${BACKUP_PATH}" ]; then
    echo "Error: Backup file not found at ${BACKUP_PATH}"
    exit 1
  fi
  
  log "Starting project restore from backup: $(basename ${BACKUP_PATH})"
  
  # Create temporary directory for extraction
  TEMP_DIR="${PROJECT_DIR}/restore_temp"
  mkdir -p "${TEMP_DIR}"
  
  # Extract the backup to the temporary directory
  log "Extracting backup..."
  tar -xzf "${BACKUP_PATH}" -C "${TEMP_DIR}"
  
  if [ $? -ne 0 ]; then
    log "Error: Failed to extract backup file."
    rm -rf "${TEMP_DIR}"
    exit 1
  fi
}

# Function to download and restore from Google Drive
restore_from_drive() {
  local BACKUP_NAME=$1
  
  echo "=== Downloading and restoring from Google Drive: ${BACKUP_NAME} ==="
  echo ""
  
  # Check if rclone is configured
  if ! rclone listremotes | grep -q "^gdrive:"; then
    echo "Error: Google Drive remote 'gdrive' not configured."
    echo "Run 'rclone config' to set up Google Drive access with the name 'gdrive'."
    exit 1
  fi
  # Check if the specific backup file exists before attempting download
  if ! rclone ls gdrive:DamnedDesigns/backups/ondemand "${BACKUP_NAME}" 2>/dev/null; then
    echo "Error: Backup file '${BACKUP_NAME}' not found in gdrive:DamnedDesigns/backups/ondemand."
    echo "Use --list to see available backups."
    exit 1
  fi
  
  echo "1. Downloading backup from Google Drive..."
  mkdir -p "${BACKUP_DIR}/downloads"
  rclone copy "gdrive:DamnedDesigns/backups/ondemand/${BACKUP_NAME}" "${BACKUP_DIR}/downloads/"
  
  if [ $? -ne 0 ]; then
    echo "Error: Failed to download backup from Google Drive."
    exit 1
  fi
  
  echo "2. Proceeding with restore..."
  restore_from_file "${BACKUP_DIR}/downloads/${BACKUP_NAME}"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  
  case $key in
    --file)
      BACKUP_FILE="$2"
      shift
      shift
      ;;
    --from-drive)
      FROM_DRIVE="$2"
      shift
      shift
      ;;
    --list)
      LIST=1
      shift
      ;;
    --help)
      HELP=1
      shift
      ;;
    *)
      # Unknown option
      echo "Unknown option: $1"
      show_usage
      exit 1
      ;;
  esac
done

# Handle different actions
if [ $HELP -eq 1 ]; then
  show_usage
  exit 0
fi

if [ $LIST -eq 1 ]; then
  list_backups
  exit 0
fi

if [ ! -z "${FROM_DRIVE}" ]; then
  restore_from_drive "${FROM_DRIVE}"
elif [ ! -z "${BACKUP_FILE}" ]; then
  # Check if it's a full path or just a filename
  if [[ "${BACKUP_FILE}" == /* ]]; then
    restore_from_file "${BACKUP_FILE}"
  else
    restore_from_file "${BACKUP_DIR}/${BACKUP_FILE}"
  fi
else
  echo "Error: No backup file specified. Use --file or --from-drive option."
  show_usage
  exit 1
fi

# Ask for confirmation
echo ""
echo "This will restore project files from backup, excluding database files."
echo "The following directories will be affected:"
echo "- /root/damneddesigns/admin"
echo "- /root/damneddesigns/backend"
echo "- /root/damneddesigns/storefront" 
echo "- /root/damneddesigns/packages"
echo "- /root/damneddesigns/documentation"
echo "- /root/damneddesigns/images"
echo ""
read -p "Do you want to stop all services and restore the project? [y/N] " CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
  echo "Restore cancelled."
  rm -rf "${TEMP_DIR}"
  exit 0
fi

# Stop services
log "Stopping all services..."
pm2 stop all

# Create a safety backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SAFETY_BACKUP_DIR="${PROJECT_DIR}/project_restore_backup_${TIMESTAMP}"
mkdir -p "${SAFETY_BACKUP_DIR}"

log "Creating safety backup of current project files..."
# List of directories to back up
DIRECTORIES=("admin" "backend" "storefront" "packages" "documentation" "images")

# Back up current directories
for DIR in "${DIRECTORIES[@]}"; do
  if [ -d "${PROJECT_DIR}/${DIR}" ]; then
    log "Backing up ${DIR}..."
    cp -a "${PROJECT_DIR}/${DIR}" "${SAFETY_BACKUP_DIR}/"
  fi
done

# Restore project files from the temp directory, preserving node_modules
log "Restoring project files..."

for DIR in "${DIRECTORIES[@]}"; do
  if [ -d "${TEMP_DIR}/${DIR}" ]; then
    # If the directory contains node_modules, preserve it to avoid long reinstall
    if [ -d "${PROJECT_DIR}/${DIR}/node_modules" ]; then
      log "Preserving node_modules in ${DIR}..."
      mv "${PROJECT_DIR}/${DIR}/node_modules" "${PROJECT_DIR}/${DIR}/node_modules.bak"
    fi
    
    # Remove the directory but keep node_modules backup
    rm -rf "${PROJECT_DIR}/${DIR}"
    
    # Copy from backup
    cp -a "${TEMP_DIR}/${DIR}" "${PROJECT_DIR}/"
    
    # Restore node_modules if we backed it up
    if [ -d "${PROJECT_DIR}/${DIR}/node_modules.bak" ]; then
      log "Restoring node_modules in ${DIR}..."
      rm -rf "${PROJECT_DIR}/${DIR}/node_modules"
      mv "${PROJECT_DIR}/${DIR}/node_modules.bak" "${PROJECT_DIR}/${DIR}/node_modules"
    fi
  fi
done

# Also restore configuration files in the main directory
for FILE in "${TEMP_DIR}"/*.{js,json,sh,md}; do
  if [ -f "${FILE}" ]; then
    BASENAME=$(basename "${FILE}")
    log "Restoring ${BASENAME}..."
    cp -f "${FILE}" "${PROJECT_DIR}/"
  fi
done

# Clean up temporary directory
log "Cleaning up temporary files..."
rm -rf "${TEMP_DIR}"

# Restart services
log "Restarting services..."
pm2 start all

log "Project restore completed successfully."
echo "===================================================="
echo "Safety backup of your previous files is at: ${SAFETY_BACKUP_DIR}"
echo "===================================================="