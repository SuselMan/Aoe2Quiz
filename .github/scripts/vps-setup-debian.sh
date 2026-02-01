#!/bin/bash
# Setup VPS (Debian 12) for AoE2 Quiz backend deploy
set -e

export DEBIAN_FRONTEND=noninteractive

echo "==> Updating apt and installing basics..."
apt-get update -qq
apt-get install -y -qq curl ca-certificates gnupg

echo "==> Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y -qq nodejs
node -v
npm -v

echo "==> Installing PM2..."
npm install -g pm2
pm2 -v

echo "==> Installing MongoDB..."
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt-get update -qq
apt-get install -y -qq mongodb-org
systemctl enable mongod
systemctl start mongod
systemctl status mongod --no-pager || true

echo "==> Creating deploy directory..."
mkdir -p /var/www/aoe2quiz-server
chown root:root /var/www/aoe2quiz-server
# GitHub Actions will deploy as VPS_USER; if not root, create user and chown
# For root deploy, current setup is fine

echo "==> Creating .env for app (edit if needed)..."
cat > /var/www/aoe2quiz-server/.env << 'ENVFILE'
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/aoe2quiz
ENVFILE
chmod 600 /var/www/aoe2quiz-server/.env

echo "==> Setup done. Node $(node -v), npm $(npm -v), PM2 $(pm2 -v), MongoDB running."
