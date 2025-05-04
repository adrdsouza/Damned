# Damned Designs Scripts

This directory contains scripts for managing the Damned Designs e-commerce platform.

## Directory Structure

- **backup/** - Scripts for system backup and restoration
  - `backup.sh` - Full system backup script
  - `backup-now.sh` - On-demand backup script
  - `backup-incremental.sh` - Incremental backup script 
  - `backup-incremental-now.sh` - On-demand incremental backup
  - `backup-project.sh` - Code-only backup script
  - `restore.sh` - Full system restoration script
  - `restore-project.sh` - Code-only restoration script
  - `crontab_entry.txt` - Crontab configuration for automated backups

- **deployment/** - Scripts for system deployment
  - `deploy-to-production.sh` - Production deployment script

- **maintenance/** - Scripts for system maintenance
  - `check-system-health.sh` - System health check script

- **utility/** - Utility scripts
  - `start-pm2.sh` - PM2 service management script
  - `storefront-dev.sh` - Development script for storefront
  - `test-payment-providers.sh` - Test script for payment providers

- **utils/** - Miscellaneous utility scripts

## Usage

Most scripts must be run from the project root directory:

```bash
# Run a backup
./scripts/backup/backup.sh

# Deploy to production
./scripts/deployment/deploy-to-production.sh

# Check system health
./scripts/maintenance/check-system-health.sh
```