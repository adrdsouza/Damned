# Damned Designs Backup System

This document explains the backup system for Damned Designs e-commerce platform, including incremental backups and Google Drive integration.

## Backup Overview

The system uses a comprehensive backup solution that:

1. Creates daily incremental backups of:
   - Database (PostgreSQL dump)
   - Configuration files (.env files, ecosystem.config.js)
   - Caddy configuration
   - Documentation
   - Application files

2. Implements a space-efficient backup rotation strategy:
   - Daily backups: Incremental changes only to save space
   - Weekly backups: Full backup taken on Sundays
   - Monthly backups: Full backup taken on the 1st of each month

3. Uploads backups to Google Drive for off-site storage
4. Automatically cleans up old backups to conserve disk space

## Files and Locations

- **Standard Backup Script**: `/root/damneddesigns/backup.sh`
- **Incremental Backup Script**: `/root/damneddesigns/backup-incremental.sh`
- **On-Demand Backup Scripts**: 
  - `/root/damneddesigns/backup-now.sh` (Standard)
  - `/root/damneddesigns/backup-incremental-now.sh` (Incremental)
- **Local Backup Directory**: `/root/damneddesigns/backups/`
- **Log File**: `/root/damneddesigns/backup.log`
- **Google Drive Destination**: `gdrive:DamnedDesigns/backups/`

## Understanding Incremental Backups

Incremental backups are designed to save space while maintaining comprehensive backup protection:

1. **How It Works**:
   - **Weekly Full Backup**: Every Sunday, a complete backup of all files is created
   - **Daily Incremental Backups**: On other days, only files that have changed since the last backup are stored
   - **Database Backups**: For the database, a full backup is taken every day (database backups are always full)

2. **Space Efficiency**:
   - Uses hardlinks to efficiently store unchanged files
   - Only stores actual changes between backups
   - Weekly and monthly snapshots preserve the state as it was on those dates

3. **Backup Size Comparison**:
   - Full backup might be 500MB-1GB
   - Incremental daily backups might be just 5-20MB (depending on changes)

## Setting Up Google Drive Backups

To enable Google Drive backups, you need to configure rclone (already installed):

### Step 1: Run the configuration wizard
```bash
rclone config
```

### Step 2: Create new remote
When prompted:
```
No remotes found, make a new one?
n) New remote
s) Set configuration password
q) Quit config
n/s/q>
```
Type `n` and press Enter.

### Step 3: Name the remote
When asked for a name, enter exactly:
```
name> gdrive
```
This name is critical as the backup scripts look for this specific name.

### Step 4: Choose Google Drive
When shown the list of storage types:
```
Storage> drive
```

### Step 5: Configure Google Drive settings
For the following prompts:
```
client_id> [press Enter to leave blank]
client_secret> [press Enter to leave blank]
scope> 1
root_folder_id> [press Enter to leave blank]
service_account_file> [press Enter to leave blank]
Edit advanced config? n
Use auto config? n
```

### Step 6: Authorization
You'll receive a message like:
```
Please go to the following link: https://accounts.google.com/o/oauth2/auth?........
Log in and authorize rclone for access
Enter verification code>
```

1. Copy the URL
2. Open it in a browser 
3. Log in with your Google account
4. Grant the requested permissions
5. Copy the verification code
6. Paste the code back in the terminal

### Step 7: Complete configuration
For the remaining prompts:
```
Configure this as a team drive? n
Yes this is OK y
```

3. **Verify the configuration**:
   ```bash
   rclone ls gdrive:
   ```
   This should list files from your Google Drive.

4. **Create the backup destination**:
   ```bash
   rclone mkdir gdrive:DamnedDesigns
   rclone mkdir gdrive:DamnedDesigns/backups
   rclone mkdir gdrive:DamnedDesigns/backups/incremental
   rclone mkdir gdrive:DamnedDesigns/backups/incremental/weekly
   rclone mkdir gdrive:DamnedDesigns/backups/incremental/monthly
   rclone mkdir gdrive:DamnedDesigns/backups/incremental/ondemand
   rclone mkdir gdrive:DamnedDesigns/backups/db_backups
   ```

## On-Demand Backups

### Standard Full Backup
Run a standard full backup at any time:
```bash
/root/damneddesigns/backup.sh
```

### Incremental Backup
Run the incremental backup system:
```bash
/root/damneddesigns/backup-incremental.sh
```

### Advanced On-Demand Backup Tools

#### Standard On-Demand Backup
For standard backups with full file copying:
```bash
/root/damneddesigns/backup-now.sh [OPTIONS]
```

Options:
- `--skip-drive`: Create backup without uploading to Google Drive
- `--no-compress`: Skip compression for faster backup (larger files)
- `--db-only`: Back up only the database (no config files)
- `--help`: Show help message

#### Incremental On-Demand Backup
For space-efficient incremental backups:
```bash
/root/damneddesigns/backup-incremental-now.sh [OPTIONS]
```

Options:
- `--db-only`: Back up only the database (no config files)
- `--skip-drive`: Create backup without uploading to Google Drive
- `--full`: Force a full backup instead of incremental
- `--help`: Show help message

#### Examples:
```bash
# Quick database-only incremental backup
/root/damneddesigns/backup-incremental-now.sh --db-only

# Full incremental backup without uploading to Google Drive
/root/damneddesigns/backup-incremental-now.sh --skip-drive

# Force a full backup instead of incremental
/root/damneddesigns/backup-incremental-now.sh --full
```

On-demand backups are stored in:
- Standard: `/root/damneddesigns/backups/ondemand/`
- Incremental: `/root/damneddesigns/backups/incremental/ondemand/`

## Scheduled Backups

The system is configured to run automatic backups:

- **Schedule**: Daily at 3:00 AM
- **Configuration**: Set in system crontab

To modify the schedule:
```bash
crontab -e
```

To use incremental backups in the scheduled task, update your crontab to use the incremental script:
```
0 3 * * * /bin/bash /root/damneddesigns/backup-incremental.sh >> /root/damneddesigns/backup.log 2>&1
```

## Restoring from Backup

### Using the Restore Script (Recommended)

We've created a comprehensive restore script that makes the restoration process easy and handles all types of backups:

```bash
/root/damneddesigns/restore.sh [OPTIONS]
```

#### Options Available:

- `--standard BACKUP_FILE`: Restore from a standard backup file (e.g., damneddesigns_backup_20250423_123456.tar.gz)
- `--incremental BACKUP_DIR`: Restore from an incremental backup directory (e.g., weekly/week25_2025)
- `--db-only DB_FILE`: Restore only the database from a backup file
- `--from-drive BACKUP_NAME`: Download and restore from a backup on Google Drive
- `--list`: List all available backups (local and on Google Drive)
- `--help`: Show detailed help message

#### Examples:

```bash
# List all available backups (local and on Google Drive)
/root/damneddesigns/restore.sh --list

# Restore from a standard backup file
/root/damneddesigns/restore.sh --standard damneddesigns_backup_20250423_123456.tar.gz

# Restore from a weekly incremental backup
/root/damneddesigns/restore.sh --incremental weekly/week25_2025

# Restore only the database
/root/damneddesigns/restore.sh --db-only db_backups/weekly/medusa_db_week25_2025.sql.gz

# Download and restore from Google Drive
/root/damneddesigns/restore.sh --from-drive damneddesigns_backup_20250423_123456.tar.gz
```

The script handles all the necessary steps including:
- Stopping all services
- Creating database backups before restoring
- Restoring database and configuration files
- Preserving node_modules to avoid lengthy reinstalls
- Restarting all services
- Creating safety backups of current files

### Manual Restoration (Alternative Method)

If you prefer to restore manually or need more control over the process, follow these steps:

#### Restoring from Incremental Backup

1. **List available backups**:
   ```bash
   # List weekly backups
   ls /root/damneddesigns/backups/incremental/weekly/
   
   # List monthly backups
   ls /root/damneddesigns/backups/incremental/monthly/
   
   # List on-demand backups
   ls /root/damneddesigns/backups/incremental/ondemand/
   ```

2. **Restore files**:
   ```bash
   # Restore files from a weekly backup
   rsync -a /root/damneddesigns/backups/incremental/weekly/week25_2025/ /path/to/destination/
   
   # Restore files from an on-demand backup
   rsync -a /root/damneddesigns/backups/incremental/ondemand/backup_20250423_114755/ /path/to/destination/
   ```

3. **Restore database**:
   ```bash
   # Stop services
   pm2 stop all
   
   # Select and decompress a database backup
   gunzip -c /root/damneddesigns/backups/db_backups/weekly/medusa_db_week25_2025.sql.gz > /tmp/restored_db.sql
   
   # Restore database
   PGPASSWORD=adrdsouza psql -h localhost -U myuser -d medusa-medusaapp < /tmp/restored_db.sql
   
   # Start services
   pm2 start all
   ```

#### Restoring from Standard Backup

1. **Download from Google Drive if needed**:
   ```bash
   # List all backups
   rclone ls gdrive:DamnedDesigns/backups
   
   # Download a specific backup
   rclone copy gdrive:DamnedDesigns/backups/damneddesigns_backup_20250423_123456.tar.gz /root/damneddesigns/backups/
   ```

2. **Extract the backup**:
   ```bash
   cd /root/damneddesigns/backups
   tar -xzvf damneddesigns_backup_20250423_123456.tar.gz
   ```

3. **Restore database**:
   ```bash
   # Stop services
   pm2 stop all
   
   # Restore database
   PGPASSWORD=adrdsouza psql -h localhost -U myuser -d medusa-medusaapp < /path/to/extracted/medusa_db_timestamp.sql
   ```

4. **Restore configuration files**:
   ```bash
   # Copy config files to their respective locations
   cp /path/to/extracted/backend.env /root/damneddesigns/backend/.env
   cp /path/to/extracted/storefront.env /root/damneddesigns/storefront/.env
   cp /path/to/extracted/admin.env /root/damneddesigns/admin/.env
   cp /path/to/extracted/ecosystem.config.js /root/damneddesigns/
   cp /path/to/extracted/Caddyfile /etc/caddy/
   ```

5. **Restart services**:
   ```bash
   systemctl restart caddy
   pm2 start all
   ```

## Troubleshooting

- **Check backup logs**: `cat /root/damneddesigns/backup.log`
- **Test rclone connection**: `rclone ls gdrive:DamnedDesigns`
- **Manual Google Drive upload**: `rclone copy /path/to/file gdrive:DamnedDesigns/backups`
- **Check cron job status**: `grep backup /var/log/syslog`
- **Check backup integrity**: 
  ```bash
  # List files in an incremental backup
  find /root/damneddesigns/backups/incremental/weekly/week25_2025 -type f | wc -l
  
  # Verify a database backup
  gunzip -t /root/damneddesigns/backups/db_backups/weekly/medusa_db_week25_2025.sql.gz
  ```

## Monitoring Backup Size

Monitor backup sizes with:
```bash
# Standard backups
du -sh /root/damneddesigns/backups/ondemand/*

# Incremental backups
du -sh /root/damneddesigns/backups/incremental/current
du -sh /root/damneddesigns/backups/incremental/weekly/*
du -sh /root/damneddesigns/backups/incremental/monthly/*

# Database backups
du -sh /root/damneddesigns/backups/db_backups/daily/*
du -sh /root/damneddesigns/backups/db_backups/weekly/*
```

## Comparing Standard vs. Incremental Backups

| Feature | Standard Backup | Incremental Backup |
|---------|----------------|-------------------|
| Space Usage | Higher (full copies) | Lower (only changes) |
| Backup Speed | Slower for full backups | Faster for daily backups |
| Restore Complexity | Simple extract and copy | Requires rsync to restore |
| Database Handling | Full backup each time | Full backup each time |
| Google Drive Usage | Higher bandwidth | Lower bandwidth for daily backups |

## When to Use Which System

- **Use Standard Backups When**:
  - You need a simple, single-file backup
  - Storage space is not a concern
  - You prefer simpler restore procedures

- **Use Incremental Backups When**:
  - Storage space is limited
  - You want faster daily backups
  - You need point-in-time snapshots with minimal space usage

## Project-Only Backups (No Database)

For situations where you only need to back up the codebase without the database, we've created specialized tools:

### When to Use Project-Only Backups

Project-only backups are ideal for these scenarios:

- **Before Code Changes**: Create a backup before making significant changes to the codebase
- **Code Sharing**: Share the codebase with other developers without transferring sensitive database content
- **Migration**: When moving to a new server but keeping the same database
- **Testing**: Set up testing environments with the same code but different databases
- **Version Control**: Supplement to Git or when Git is not being used

### Project-Only Backup Instructions

#### Creating a Project-Only Backup

```bash
# Run the basic project backup script
/root/damneddesigns/backup-project.sh

# Skip Google Drive upload
/root/damneddesigns/backup-project.sh --skip-drive

# View help and options
/root/damneddesigns/backup-project.sh --help
```

The script will:
1. Create a backup directory at `/root/damneddesigns/backups/project/`
2. Exclude database files (*.sql, *.db, *.sqlite) and database directories
3. Create a compressed tar.gz archive with a timestamp in the filename
4. Upload to Google Drive (unless --skip-drive option is used)
5. Display the backup location and size

#### Restoring from a Project-Only Backup

```bash
# List available backups (local and on Google Drive)
/root/damneddesigns/restore-project.sh --list

# Restore from a local backup file
/root/damneddesigns/restore-project.sh --file damneddesigns_project_backup_YYYYMMDD_HHMMSS.tar.gz

# Download and restore from Google Drive
/root/damneddesigns/restore-project.sh --from-drive damneddesigns_project_backup_YYYYMMDD_HHMMSS.tar.gz

# Show help and options
/root/damneddesigns/restore-project.sh --help
```

The restore process:
1. Extracts the backup to a temporary directory
2. Stops all running services
3. Creates a safety backup of current project files
4. Restores all project files while preserving node_modules directories
5. Restarts all services

### Limitations of Project-Only Backups

- **No Database Content**: These backups intentionally exclude database files
- **Configuration Dependencies**: Some configuration may reference specific database settings
- **Service Dependencies**: Some services may require database restoration to function properly

### Integration with Main Backup System

The project-only backup system follows similar patterns to the main backup system:

- Files are stored in `/root/damneddesigns/backups/project/`
- Google Drive integration uses `gdrive:DamnedDesigns/backups/project/`
- Complementary to the database-only backup option described earlier