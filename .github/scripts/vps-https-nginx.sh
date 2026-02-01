#!/bin/bash
# HTTPS на VPS: Nginx + Let's Encrypt (certbot), автообновление сертификатов.
# Запускать на VPS (root): bash vps-https-nginx.sh
# Домен: 5re6.l.time4vps.cloud (или задать DOMAIN=... перед запуском).
set -e

DOMAIN="${DOMAIN:-5re6.l.time4vps.cloud}"
BACKEND_PORT="${BACKEND_PORT:-3000}"

echo "==> Installing Nginx and Certbot..."
apt-get update -qq
apt-get install -y -qq nginx certbot python3-certbot-nginx

echo "==> Creating Nginx config for $DOMAIN (proxy to 127.0.0.1:$BACKEND_PORT)..."
cat > /etc/nginx/sites-available/aoe2quiz << NGINX
server {
    listen 80;
    server_name $DOMAIN;
    location / {
        proxy_pass http://127.0.0.1:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/aoe2quiz /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "==> Getting TLS certificate (Let's Encrypt)..."
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email --redirect

echo "==> Enabling certbot auto-renewal (systemd timer)..."
systemctl enable certbot.timer
systemctl start certbot.timer

echo "==> Done. HTTPS: https://$DOMAIN (proxies to backend :$BACKEND_PORT)"
echo "    Renewal: certbot renew (runs automatically twice per day)"
