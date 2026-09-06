#!/bin/bash
set -e

cd /home/attabi/Documents/WEBSITE/AGORAACTA_WEBSITE/strapi-cms

echo "=== 1. Exporting MySQL Data ==="
./node_modules/.bin/strapi export --no-encrypt -f backup-mysql

echo "=== 2. Updating .env to PostgreSQL ==="
sed -i 's/DATABASE_CLIENT=mysql/DATABASE_CLIENT=postgres/' .env
sed -i 's/DATABASE_HOST=.*/DATABASE_HOST=127.0.0.1/' .env
sed -i 's/DATABASE_PORT=3306/DATABASE_PORT=5433/' .env
sed -i 's/DATABASE_NAME=.*/DATABASE_NAME=strapi_osis/' .env
sed -i 's/DATABASE_USERNAME=.*/DATABASE_USERNAME=strapi/' .env
sed -i 's/DATABASE_PASSWORD=.*/DATABASE_PASSWORD=strapipassword/' .env

echo "=== 3. Importing data into PostgreSQL ==="
./node_modules/.bin/strapi import -f backup-mysql.tar.gz

echo "=== 4. Restarting PM2 ==="
pm2 restart osis-strapi-backend

echo "=== MIGRATION COMPLETED SUCCESSFULLY ==="
