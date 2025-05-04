#!/bin/bash
set -e

cd /root/damneddesigns

echo "Pulling latest code from git..."
git pull

cd scripts/utility
chmod +x setup-or-reset-all.sh
./setup-or-reset-all.sh
