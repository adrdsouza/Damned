# Documentation

## Introduction
This documentation provides an overview of the project, its structure, and how to set it up and deploy it.

## Table of Contents
1. [Introduction](#introduction)
2. [Setup](#setup)
3. [Deployment](#deployment)
4. [GitHub Actions Workflow for Automated Deployment](#github-actions-workflow-for-automated-deployment)
5. [Quick Reset & Environment Setup](#quick-reset--environment-setup)
6. [Automated Reset Script](#automated-reset-script)
7. [Automated Setup & Reset Script](#automated-setup--reset-script)

## Setup
Follow these steps to set up the project on your local machine.

## Deployment
Instructions for deploying the project to a production environment.

## GitHub Actions Workflow for Automated Deployment

This workflow will automatically deploy your project to your RackNerd server, securely injecting environment variables from GitHub Secrets and restarting all services. 

### 1. Prerequisites
- Your server must have SSH access enabled.
- You need a user with permission to deploy and restart services (e.g., root or a deploy user).
- Add your server's SSH private key as a GitHub Secret (e.g., `SSH_PRIVATE_KEY`).
- Add your server's IP/hostname as a GitHub Secret (e.g., `SERVER_HOST`).
- Add your server's SSH username as a GitHub Secret (e.g., `SERVER_USER`).
- Add all required environment variables as GitHub Secrets (e.g., `MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, etc.).

### 2. Example Workflow: `.github/workflows/deploy.yml`

```yaml
name: Deploy to RackNerd

on:
  workflow_dispatch:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up SSH
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}

      - name: Copy code to server
        run: |
          rsync -az --delete --exclude='.git*' --exclude='node_modules' ./ ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_HOST }}:/root/damneddesigns/

      - name: Write environment files
        run: |
          ssh ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_HOST }} '
            echo "MEDUSA_BACKEND_URL=${{ secrets.MEDUSA_BACKEND_URL }}" > /root/damneddesigns/backend/.env && \
            echo "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${{ secrets.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY }}" > /root/damneddesigns/storefront/.env && \
            echo "NEXT_PUBLIC_BASE_URL=${{ secrets.NEXT_PUBLIC_BASE_URL }}" >> /root/damneddesigns/storefront/.env && \
            echo "NEXT_PUBLIC_DEFAULT_REGION=${{ secrets.NEXT_PUBLIC_DEFAULT_REGION }}" >> /root/damneddesigns/storefront/.env && \
            echo "REVALIDATE_SECRET=${{ secrets.REVALIDATE_SECRET }}" >> /root/damneddesigns/storefront/.env && \
            echo "PORT=6162" > /root/damneddesigns/images/.env && \
            echo "DOMAIN_URL=${{ secrets.IMAGES_DOMAIN_URL }}" >> /root/damneddesigns/images/.env && \
            echo "UPLOAD_DIR=static" >> /root/damneddesigns/images/.env && \
            echo "ALLOWED_ORIGINS=${{ secrets.IMAGES_ALLOWED_ORIGINS }}" >> /root/damneddesigns/images/.env
          '

      - name: Install dependencies and restart services
        run: |
          ssh ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_HOST }} '
            cd /root/damneddesigns && \
            npm install && \
            cd backend && npm install && npm run build && cd .. && \
            cd storefront && npm install && npm run build && cd .. && \
            cd images && npm install && cd .. && \
            pm2 restart all || pm2 start ecosystem.config.js && pm2 save
          '
```

### 3. How to Use
- Add this file as `.github/workflows/deploy.yml` in your repo.
- Add all required secrets in your GitHub repository settings.
- Trigger the workflow manually or on push to main.

---

This workflow will ensure your environment variables are always up to date and your services are rebuilt and restarted automatically on every deployment.

## Quick Reset & Environment Setup

For fast recovery or setup on a new server, use the provided `.env.template` files in each service directory:

- `/root/damneddesigns/backend/.env.template`
- `/root/damneddesigns/storefront/.env.template`
- `/root/damneddesigns/images/.env.template`

**To reset your environment:**
1. Copy each `.env.template` to `.env` in the same directory:
   ```bash
   cp backend/.env.template backend/.env
   cp storefront/.env.template storefront/.env
   cp images/.env.template images/.env
   ```
2. Edit the new `.env` files to fill in your real secrets and keys.
3. Rebuild and restart all services:
   ```bash
   cd /root/damneddesigns
   ./rebuild-and-restart.sh
   ```

Alternatively, use the provided `reset-env-and-restart.sh` script for a one-command reset (see below).

---

## Automated Reset Script

You can use the following script to automate copying `.env.template` to `.env` and restarting all services. Save this as `/root/damneddesigns/reset-env-and-restart.sh`:

```bash
#!/bin/bash
set -e

cd /root/damneddesigns

cp backend/.env.template backend/.env
cp storefront/.env.template storefront/.env
cp images/.env.template images/.env

echo "Copied .env.template files to .env. Please edit .env files to add real secrets if needed."

./rebuild-and-restart.sh
```

Make it executable:
```bash
chmod +x /root/damneddesigns/reset-env-and-restart.sh
```

---

This ensures you can always quickly restore your environment and restart all services with minimal manual steps.

## Automated Setup & Reset Script

To fully automate setup or a full reset, use the script at `scripts/utility/setup-or-reset-all.sh`:

```bash
cd /root/damneddesigns/scripts/utility
chmod +x setup-or-reset-all.sh
./setup-or-reset-all.sh
```

**What this script does:**
1. Copies `.env.template` files to `.env` for backend, storefront, and images.
2. Pauses so you can edit the `.env` files and enter your real secrets/configuration.
3. Installs dependencies and builds all services.
4. Restarts all services with PM2.

This ensures a clean, repeatable setup or reset process for any new server or recovery scenario.