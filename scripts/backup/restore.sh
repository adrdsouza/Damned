#!/bin/bash
# Damned Designs Restore Script
# This script helps restore the system from backup

# Function to show usage
show_usage() {
  echo "Damned Designs Restore Tool"
  echo ""
  echo "Usage: ./restore.sh [OPTIONS]"
  echo ""
  echo "Options:"
  echo "  --standard BACKUP_FILE   Restore from a standard backup file (e.g., damneddesigns_backup_20250423_123456.tar.gz)"
  echo "  --incremental BACKUP_DIR Restore from an incremental backup directory (e.g., week25_2025)"
  echo "  --db-only DB_FILE        Restore only the database from a backup file"
  echo "  --from-drive BACKUP_NAME Download and restore from a backup on Google Drive"
  echo "  --list                   List available backups (local and on Google Drive)"
  echo "  --help                   Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./restore.sh --list"
  echo "  ./restore.sh --standard damneddesigns_backup_20250423_123456.tar.gz"
  echo "  ./restore.sh --incremental weekly/week25_2025"
  echo "  ./restore.sh --db-only db_backups/weekly/medusa_db_week25_2025.sql.gz"
  echo "  ./restore.sh --from-drive damneddesigns_backup_20250423_123456.tar.gz"
  echo ""
}

# Function to list available backups
list_backups() {
  echo "=== Available Local Backups ==="
  echo ""
  
  echo "Standard Backups:"
  find /root/damneddesigns/backups -name "damneddesigns_backup_*.tar.gz" -type f | sort
  
  echo ""
  echo "Incremental Backups:"
  echo "Weekly:"
  ls -la /root/damneddesigns/backups/incremental/weekly/ 2>/dev/null || echo "No weekly backups found"
  
  echo ""
  echo "Monthly:"
  ls -la /root/damneddesigns/backups/incremental/monthly/ 2>/dev/null || echo "No monthly backups found"
  
  echo ""
  echo "On-Demand:"
  ls -la /root/damneddesigns/backups/incremental/ondemand/ 2>/dev/null || echo "No on-demand backups found"
  
  echo ""
  echo "Database Backups:"
  find /root/damneddesigns/backups/db_backups -name "*.sql.gz" -type f | sort
  
  echo ""
  echo "=== Available Google Drive Backups ==="
  echo ""
  
  if rclone ls gdrive:DamnedDesigns/backups 2>/dev/null; then
    echo ""
    echo "Standard Backups:"
    rclone ls gdrive:DamnedDesigns/backups/ | grep -v "/" | grep "damneddesigns_backup_"
    
    echo ""
    echo "Incremental Weekly Backups:"
    rclone lsd gdrive:DamnedDesigns/backups/incremental/weekly/ 2>/dev/null || echo "No weekly backups found on Google Drive"
    
    echo ""
    echo "Incremental Monthly Backups:"
    rclone lsd gdrive:DamnedDesigns/backups/incremental/monthly/ 2>/dev/null || echo "No monthly backups found on Google Drive"
    
    echo ""
    echo "Database Backups:"
    rclone ls gdrive:DamnedDesigns/backups/db_backups/weekly/ 2>/dev/null || echo "No weekly DB backups found on Google Drive"
    echo ""
    rclone ls gdrive:DamnedDesigns/backups/db_backups/monthly/ 2>/dev/null || echo "No monthly DB backups found on Google Drive"
  else
    echo "Google Drive connection not available or not configured."
    echo "Run 'rclone config' to set up Google Drive access."
  fi
}

# Function to restore from standard backup
restore_standard_backup() {
  local BACKUP_FILE=$1
  
  if [ ! -f "/root/damneddesigns/backups/$BACKUP_FILE" ]; then
    echo "Error: Backup file not found at /root/damneddesigns/backups/$BACKUP_FILE"
    exit 1
  fi
  
  echo "=== Restoring from standard backup: $BACKUP_FILE ==="
  echo ""
  
  # Create temp directory for extraction
  local TEMP_DIR="/root/damneddesigns/backups/temp_restore_$(date +%s)"
  mkdir -p "$TEMP_DIR"
  
  echo "1. Extracting backup..."
  tar -xzvf "/root/damneddesigns/backups/$BACKUP_FILE" -C "$TEMP_DIR"
  
  if [ $? -ne 0 ]; then
    echo "Error: Failed to extract backup file."
    rm -rf "$TEMP_DIR"
    exit 1
  fi
  
  # Find the timestamp directory
  local TIMESTAMP_DIR=$(find "$TEMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -1)
  
  if [ -z "$TIMESTAMP_DIR" ]; then
    echo "Error: Could not find extracted content in the backup."
    rm -rf "$TEMP_DIR"
    exit 1
  fi
  
  # Ask for confirmation to continue
  read -p "Do you want to stop all services and restore from this backup? [y/N] " CONFIRM
  if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Restore cancelled."
    rm -rf "$TEMP_DIR"
    exit 0
  fi
  
  echo "2. Stopping all services..."
  pm2 stop all
  
  # Find database backup
  local DB_FILE=$(find "$TIMESTAMP_DIR" -name "medusa_db_*.sql" | head -1)
  
  if [ ! -z "$DB_FILE" ]; then
    echo "3. Restoring database..."
    echo "   Creating fresh database..."
    PGPASSWORD=adrdsouza psql -h localhost -U myuser -c "DROP DATABASE IF EXISTS \"medusa-medusaapp\";"
    PGPASSWORD=adrdsouza psql -h localhost -U myuser -c "CREATE DATABASE \"medusa-medusaapp\";"
    
    echo "   Importing database dump..."
    PGPASSWORD=adrdsouza psql -h localhost -U myuser -d medusa-medusaapp < "$DB_FILE"
    
    if [ $? -ne 0 ]; then
      echo "Warning: Database restore encountered errors."
    else
      echo "   Database restored successfully."
    fi
  else
    echo "Warning: No database backup found in the archive."
  fi
  
  echo "4. Restoring configuration files..."
  
  # Restore environment files
  if [ -f "$TIMESTAMP_DIR/backend.env" ]; then
    cp "$TIMESTAMP_DIR/backend.env" /root/damneddesigns/backend/.env
    echo "   Restored backend environment file."
  fi
  
  if [ -f "$TIMESTAMP_DIR/storefront.env" ]; then
    cp "$TIMESTAMP_DIR/storefront.env" /root/damneddesigns/storefront/.env
    echo "   Restored storefront environment file."
  fi
  
  if [ -f "$TIMESTAMP_DIR/admin.env" ]; then
    cp "$TIMESTAMP_DIR/admin.env" /root/damneddesigns/admin/.env
    echo "   Restored admin environment file."
  fi
  
  # Restore ecosystem config
  if [ -f "$TIMESTAMP_DIR/ecosystem.config.js" ]; then
    cp "$TIMESTAMP_DIR/ecosystem.config.js" /root/damneddesigns/ecosystem.config.js
    echo "   Restored PM2 ecosystem config."
  fi
  
  # Restore Caddyfile
  if [ -f "$TIMESTAMP_DIR/Caddyfile" ]; then
    cp "$TIMESTAMP_DIR/Caddyfile" /etc/caddy/Caddyfile
    echo "   Restored Caddy configuration."
    echo "   Restarting Caddy service..."
    systemctl restart caddy
  fi
  
  echo "5. Restarting services..."
  pm2 start all
  
  echo "6. Cleaning up temporary files..."
  rm -rf "$TEMP_DIR"
  
  echo ""
  echo "=== Restore completed successfully ==="
  echo "If any services are not working properly, check the logs:"
  echo "  journalctl -u caddy | tail -50"
  echo "  pm2 logs --lines 50"
}

# Function to restore from incremental backup
restore_incremental_backup() {
  local BACKUP_DIR=$1
  
  # Check if the backup directory exists
  if [[ ! "$BACKUP_DIR" == *"/"* ]]; then
    # If no slash is in the path, assume it's a top-level directory
    echo "Error: Please specify the full path in the format: weekly/week25_2025 or monthly/2025_04"
    exit 1
  fi
  
  local BACKUP_TYPE=$(echo "$BACKUP_DIR" | cut -d'/' -f1)
  local BACKUP_NAME=$(echo "$BACKUP_DIR" | cut -d'/' -f2)
  
  if [ -z "$BACKUP_TYPE" ] || [ -z "$BACKUP_NAME" ]; then
    echo "Error: Invalid backup directory format. Expected format: weekly/week25_2025 or monthly/2025_04"
    exit 1
  fi
  
  local FULL_BACKUP_PATH="/root/damneddesigns/backups/incremental/$BACKUP_TYPE/$BACKUP_NAME"
  
  if [ ! -d "$FULL_BACKUP_PATH" ]; then
    echo "Error: Backup directory not found at $FULL_BACKUP_PATH"
    exit 1
  fi
  
  echo "=== Restoring from incremental backup: $BACKUP_TYPE/$BACKUP_NAME ==="
  echo ""
  
  # Ask for confirmation to continue
  read -p "Do you want to stop all services and restore from this backup? [y/N] " CONFIRM
  if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Restore cancelled."
    exit 0
  fi
  
  echo "1. Stopping all services..."
  pm2 stop all
  
  echo "2. Checking for corresponding database backup..."
  local DB_BACKUP=""
  
  # Search for database backup based on the backup type and name
  if [ "$BACKUP_TYPE" == "weekly" ]; then
    # Extract week number and year
    local WEEK_NUM=$(echo "$BACKUP_NAME" | sed 's/week\([0-9]*\)_.*/\1/')
    local YEAR=$(echo "$BACKUP_NAME" | sed 's/week[0-9]*_\(.*\)/\1/')
    
    DB_BACKUP="/root/damneddesigns/backups/db_backups/weekly/medusa_db_week${WEEK_NUM}_${YEAR}.sql.gz"
  elif [ "$BACKUP_TYPE" == "monthly" ]; then
    # Extract year and month
    DB_BACKUP="/root/damneddesigns/backups/db_backups/monthly/medusa_db_${BACKUP_NAME}.sql.gz"
  else
    # For on-demand backups, try to match by timestamp
    local TIMESTAMP=$(echo "$BACKUP_NAME" | sed 's/backup_\(.*\)/\1/')
    DB_BACKUP="/root/damneddesigns/backups/db_backups/ondemand/medusa_db_${TIMESTAMP}.sql.gz"
  fi
  
  # Check if the database backup exists
  if [ -f "$DB_BACKUP" ]; then
    echo "   Found database backup: $DB_BACKUP"
    
    echo "3. Restoring database..."
    echo "   Creating fresh database..."
    PGPASSWORD=adrdsouza psql -h localhost -U myuser -c "DROP DATABASE IF EXISTS \"medusa-medusaapp\";"
    PGPASSWORD=adrdsouza psql -h localhost -U myuser -c "CREATE DATABASE \"medusa-medusaapp\";"
    
    echo "   Importing database dump..."
    gunzip -c "$DB_BACKUP" | PGPASSWORD=adrdsouza psql -h localhost -U myuser -d medusa-medusaapp
    
    if [ $? -ne 0 ]; then
      echo "Warning: Database restore encountered errors."
    else
      echo "   Database restored successfully."
    fi
  else
    echo "Warning: Could not find a matching database backup for $BACKUP_TYPE/$BACKUP_NAME"
    echo "Please restore the database manually using a separate backup file."
  fi
  
  echo "4. Restoring configuration files..."
  # Look for config files in the backup
  if [ -d "$FULL_BACKUP_PATH/configs" ]; then
    # Restore environment files
    if [ -f "$FULL_BACKUP_PATH/configs/backend.env" ]; then
      cp "$FULL_BACKUP_PATH/configs/backend.env" /root/damneddesigns/backend/.env
      echo "   Restored backend environment file."
    fi
    
    if [ -f "$FULL_BACKUP_PATH/configs/storefront.env" ]; then
      cp "$FULL_BACKUP_PATH/configs/storefront.env" /root/damneddesigns/storefront/.env
      echo "   Restored storefront environment file."
    fi
    
    if [ -f "$FULL_BACKUP_PATH/configs/admin.env" ]; then
      cp "$FULL_BACKUP_PATH/configs/admin.env" /root/damneddesigns/admin/.env
      echo "   Restored admin environment file."
    fi
    
    # Restore ecosystem config
    if [ -f "$FULL_BACKUP_PATH/configs/ecosystem.config.js" ]; then
      cp "$FULL_BACKUP_PATH/configs/ecosystem.config.js" /root/damneddesigns/ecosystem.config.js
      echo "   Restored PM2 ecosystem config."
    fi
    
    # Restore Caddyfile
    if [ -f "$FULL_BACKUP_PATH/configs/Caddyfile" ]; then
      cp "$FULL_BACKUP_PATH/configs/Caddyfile" /etc/caddy/Caddyfile
      echo "   Restored Caddy configuration."
      echo "   Restarting Caddy service..."
      systemctl restart caddy
    fi
  else
    echo "Warning: No configuration files found in the backup."
    echo "Looking for configs in backup or central location..."
    
    # Try to find configs in the central location
    if [ -d "/root/damneddesigns/backups/incremental/configs" ]; then
      echo "   Found configuration files in central location."
      
      # Restore environment files from central config location
      if [ -f "/root/damneddesigns/backups/incremental/configs/backend.env" ]; then
        cp "/root/damneddesigns/backups/incremental/configs/backend.env" /root/damneddesigns/backend/.env
        echo "   Restored backend environment file from central location."
      fi
      
      if [ -f "/root/damneddesigns/backups/incremental/configs/storefront.env" ]; then
        cp "/root/damneddesigns/backups/incremental/configs/storefront.env" /root/damneddesigns/storefront/.env
        echo "   Restored storefront environment file from central location."
      fi
      
      if [ -f "/root/damneddesigns/backups/incremental/configs/admin.env" ]; then
        cp "/root/damneddesigns/backups/incremental/configs/admin.env" /root/damneddesigns/admin/.env
        echo "   Restored admin environment file from central location."
      fi
      
      # Restore ecosystem config from central location
      if [ -f "/root/damneddesigns/backups/incremental/configs/ecosystem.config.js" ]; then
        cp "/root/damneddesigns/backups/incremental/configs/ecosystem.config.js" /root/damneddesigns/ecosystem.config.js
        echo "   Restored PM2 ecosystem config from central location."
      fi
      
      # Restore Caddyfile from central location
      if [ -f "/root/damneddesigns/backups/incremental/configs/Caddyfile" ]; then
        cp "/root/damneddesigns/backups/incremental/configs/Caddyfile" /etc/caddy/Caddyfile
        echo "   Restored Caddy configuration from central location."
        echo "   Restarting Caddy service..."
        systemctl restart caddy
      fi
    fi
  fi
  
  echo "5. Restoring application files..."
  
  # Backup existing directories first
  echo "   Creating safety backup of current application files..."
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  mkdir -p "/root/damneddesigns/restore_backup_${TIMESTAMP}"
  
  # List of directories to restore
  DIRECTORIES=("backend" "storefront" "admin" "images" "documentation")
  
  # Back up current directories
  for DIR in "${DIRECTORIES[@]}"; do
    if [ -d "/root/damneddesigns/$DIR" ] && [ -d "$FULL_BACKUP_PATH/$DIR" ]; then
      echo "   Backing up current $DIR directory..."
      cp -a "/root/damneddesigns/$DIR" "/root/damneddesigns/restore_backup_${TIMESTAMP}/"
    fi
  done
  
  # Restore directories
  for DIR in "${DIRECTORIES[@]}"; do
    if [ -d "$FULL_BACKUP_PATH/$DIR" ]; then
      echo "   Restoring $DIR directory..."
      
      # If the directory contains node_modules, preserve it to avoid long reinstall
      if [ -d "/root/damneddesigns/$DIR/node_modules" ]; then
        echo "   Preserving node_modules in $DIR..."
        mv "/root/damneddesigns/$DIR/node_modules" "/root/damneddesigns/$DIR/node_modules.bak"
      fi
      
      # Remove existing directory but keep node_modules backup
      rm -rf "/root/damneddesigns/$DIR"
      
      # Copy the backup directory
      cp -a "$FULL_BACKUP_PATH/$DIR" "/root/damneddesigns/"
      
      # Restore node_modules if we backed it up
      if [ -d "/root/damneddesigns/$DIR/node_modules.bak" ]; then
        echo "   Restoring node_modules in $DIR..."
        rm -rf "/root/damneddesigns/$DIR/node_modules"
        mv "/root/damneddesigns/$DIR/node_modules.bak" "/root/damneddesigns/$DIR/node_modules"
      fi
    fi
  done
  
  echo "6. Restarting services..."
  systemctl restart caddy
  pm2 start all
  
  echo ""
  echo "=== Restore completed successfully ==="
  echo "Safety backup of your previous files is at: /root/damneddesigns/restore_backup_${TIMESTAMP}"
  echo "If any services are not working properly, check the logs:"
  echo "  journalctl -u caddy | tail -50"
  echo "  pm2 logs --lines 50"
}

# Function to restore only the database
restore_db_only() {
  local DB_FILE=$1
  
  if [ ! -f "/root/damneddesigns/backups/$DB_FILE" ]; then
    echo "Error: Database backup file not found at /root/damneddesigns/backups/$DB_FILE"
    exit 1
  fi
  
  echo "=== Restoring database from backup: $DB_FILE ==="
  echo ""
  
  # Ask for confirmation to continue
  read -p "Do you want to stop all services and restore the database? [y/N] " CONFIRM
  if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Restore cancelled."
    exit 0
  fi
  
  echo "1. Stopping all services..."
  pm2 stop damned-designs-backend
  
  echo "2. Restoring database..."
  echo "   Creating fresh database..."
  PGPASSWORD=adrdsouza psql -h localhost -U myuser -c "DROP DATABASE IF EXISTS \"medusa-medusaapp\";"
  PGPASSWORD=adrdsouza psql -h localhost -U myuser -c "CREATE DATABASE \"medusa-medusaapp\";"
  
  echo "   Importing database dump..."
  if [[ "$DB_FILE" == *.gz ]]; then
    # Gzipped SQL file
    gunzip -c "/root/damneddesigns/backups/$DB_FILE" | PGPASSWORD=adrdsouza psql -h localhost -U myuser -d medusa-medusaapp
  else
    # Regular SQL file
    PGPASSWORD=adrdsouza psql -h localhost -U myuser -d medusa-medusaapp < "/root/damneddesigns/backups/$DB_FILE"
  fi
  
  if [ $? -ne 0 ]; then
    echo "Error: Database restore failed."
    exit 1
  fi
  
  echo "3. Restarting services..."
  pm2 restart damned-designs-backend
  
  echo ""
  echo "=== Database restore completed successfully ==="
}

# Function to download and restore from Google Drive
restore_from_drive() {
  local BACKUP_NAME=$1
  
  echo "=== Downloading and restoring from Google Drive: $BACKUP_NAME ==="
  echo ""
  
  # Check if rclone is configured
  if ! rclone ls gdrive:DamnedDesigns 2>/dev/null; then
    echo "Error: Google Drive connection not available or not configured."
    echo "Run 'rclone config' to set up Google Drive access."
    exit 1
  fi
  
  echo "1. Downloading backup from Google Drive..."
  mkdir -p "/root/damneddesigns/backups/downloads"
  rclone copy "gdrive:DamnedDesigns/backups/$BACKUP_NAME" "/root/damneddesigns/backups/downloads/"
  
  if [ $? -ne 0 ]; then
    echo "Error: Failed to download backup from Google Drive."
    exit 1
  fi
  
  echo "2. Proceeding with restore..."
  
  # Check if it's a standard or incremental backup
  if [[ "$BACKUP_NAME" == *".tar.gz" ]]; then
    # Standard backup
    restore_standard_backup "downloads/$BACKUP_NAME"
  elif [[ "$BACKUP_NAME" == *"incremental"* ]]; then
    # Incremental backup
    local BACKUP_PATH=$(echo "$BACKUP_NAME" | sed 's|^incremental/||')
    restore_incremental_backup "$BACKUP_PATH"
  elif [[ "$BACKUP_NAME" == *"db_backups"* ]]; then
    # Database backup
    local DB_PATH=$(echo "$BACKUP_NAME" | sed 's|^db_backups/||')
    restore_db_only "downloads/$DB_PATH"
  else
    echo "Error: Unknown backup format. Cannot automatically determine the restore method."
    exit 1
  fi
}

# Main script execution
if [ $# -eq 0 ]; then
  show_usage
  exit 1
fi

case "$1" in
  --standard)
    if [ -z "$2" ]; then
      echo "Error: No backup file specified."
      show_usage
      exit 1
    fi
    restore_standard_backup "$2"
    ;;
  --incremental)
    if [ -z "$2" ]; then
      echo "Error: No backup directory specified."
      show_usage
      exit 1
    fi
    restore_incremental_backup "$2"
    ;;
  --db-only)
    if [ -z "$2" ]; then
      echo "Error: No database backup file specified."
      show_usage
      exit 1
    fi
    restore_db_only "$2"
    ;;
  --from-drive)
    if [ -z "$2" ]; then
      echo "Error: No backup name specified."
      show_usage
      exit 1
    fi
    restore_from_drive "$2"
    ;;
  --list)
    list_backups
    ;;
  --help)
    show_usage
    ;;
  *)
    echo "Error: Unknown option $1"
    show_usage
    exit 1
    ;;
esac