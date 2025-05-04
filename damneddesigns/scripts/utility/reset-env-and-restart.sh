#!/bin/bash
set -e

cd /root/damneddesigns

cp backend/.env.template backend/.env
cp storefront/.env.template storefront/.env
cp images/.env.template images/.env

echo "Copied .env.template files to .env. Please edit .env files to add real secrets if needed."

./rebuild-and-restart.sh
