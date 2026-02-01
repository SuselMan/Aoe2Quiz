# Деплой бекенда на VPS (GitHub Actions)

При пуше в ветку `master` (если менялись файлы в `server/`) бекенд автоматически деплоится на ваш VPS.

## Секреты в GitHub

В репозитории: **Settings → Secrets and variables → Actions** добавьте:

| Имя           | Описание                          | Пример        |
|---------------|-----------------------------------|---------------|
| `VPS_HOST`    | Адрес VPS (IP или домен)          | `123.45.67.89` или `vps.example.com` |
| `VPS_USER`    | Имя пользователя SSH на VPS       | `deploy` или `root` |
| `VPS_PASSWORD`| Пароль этого пользователя         | —             |
| `DEPLOY_PATH` | (опционально) Папка на VPS для приложения | по умолчанию `/var/www/aoe2quiz-server` |

## Что должно быть на VPS (Debian)

1. **Node.js 20** и **npm**  
   Например: `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs`

2. **PM2** (менеджер процессов)  
   `sudo npm install -g pm2`

3. **MongoDB** (локально или доступ по сети)  
   Локально: `sudo apt install mongodb` или [официальная инструкция](https://www.mongodb.com/docs/manual/administration/install-on-linux/).

4. **Переменные окружения** для приложения (порт, MongoDB):  
   Настройте через `~/.bashrc`, `~/.profile` или создайте в папке деплоя файл `.env` (если будете подгружать его вручную).  
   Нужны: `PORT` (по умолчанию 3000), `MONGODB_URI`.

5. **Права на папку деплоя**  
   У пользователя из `VPS_USER` должны быть права на запись в `DEPLOY_PATH` (например: `sudo mkdir -p /var/www/aoe2quiz-server && sudo chown $VPS_USER /var/www/aoe2quiz-server`).

После первого деплоя workflow сам выполнит `pm2 start`; при следующих — `pm2 restart aoe2quiz-server`.

---

## HTTPS (Nginx + Let's Encrypt)

Чтобы клиент ходил по `https://5re6.l.time4vps.cloud`, на VPS нужно поднять Nginx и получить сертификат.

1. На VPS выполните (или скопируйте и запустите скрипт из репозитория):
   ```bash
   # Из папки проекта на своей машине:
   scp .github/scripts/vps-https-nginx.sh root@185.81.164.26:
   ssh root@185.81.164.26 'bash vps-https-nginx.sh'
   ```
   Либо вручную: установите `nginx` и `certbot python3-certbot-nginx`, настройте виртуальный хост с `proxy_pass` на `127.0.0.1:3000`, затем `certbot --nginx -d 5re6.l.time4vps.cloud`.

2. В GitHub Secrets задайте **VPS_HOST** = `5re6.l.time4vps.cloud` (вместо IP), чтобы в логах и при необходимости использовать домен.

3. Сертификаты Let's Encrypt продлеваются автоматически (таймер certbot).

**Хост для клиента:** `https://5re6.l.time4vps.cloud` (уже прописан в `aoe2quiz/app/config/api.ts` для production-сборки).
