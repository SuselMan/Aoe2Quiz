# AoE2 Quiz — Multiplayer Server

Node.js + TypeScript + MongoDB + Socket.io backend for multiplayer matchmaking and games.

## Requirements

- Node.js 18+
- MongoDB (local or remote)

## Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env: set MONGODB_URI and optionally PORT
```

## Run

```bash
# Development (with reload)
npm run dev

# Production
npm run build
npm start
```

## Env

- `PORT` — HTTP/Socket.io port (default 3000)
- `MONGODB_URI` — MongoDB connection string (default `mongodb://localhost:27017/aoe2quiz`)

## Client

In the app, set the server URL in `app/config/api.ts` (`MULTIPLAYER_SERVER_URL`). For a device/emulator, use your machine's IP instead of `localhost` (e.g. `http://192.168.1.10:3000`).
