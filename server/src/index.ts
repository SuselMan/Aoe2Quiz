import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import config from './config';
import { registerSocketHandlers } from './room';
import { handleLeaderboardRequest } from './leaderboard';

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

server.prependListener('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
  if (handleLeaderboardRequest(req, res)) return;
});

async function main() {
  await mongoose.connect(config.MONGODB_URI);
  console.log('MongoDB connected');

  registerSocketHandlers(io);

  server.listen(config.PORT, () => {
    console.log(`Server listening on port ${config.PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
