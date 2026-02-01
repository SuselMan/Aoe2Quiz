import type { Server, Socket } from 'socket.io';
import config from './config';
import { getLevelIdForQuestionIndex } from './multiplayerLevels';

export type QueuedPlayer = {
  socketId: string;
  deviceId: string;
  name: string;
  civId: string;
  rating: number;
  joinedAt: number;
};

const queue: QueuedPlayer[] = [];
const timeoutHandles = new Map<string, NodeJS.Timeout>();

function findBestOpponent(me: QueuedPlayer): QueuedPlayer | null {
  if (queue.length < 1) return null;
  const others = queue.filter((p) => p.socketId !== me.socketId);
  if (others.length === 0) return null;
  const byRating = others.slice().sort((a, b) => Math.abs(a.rating - me.rating) - Math.abs(b.rating - me.rating));
  return byRating[0] ?? null;
}

function removeFromQueue(socketId: string): void {
  const idx = queue.findIndex((p) => p.socketId === socketId);
  if (idx !== -1) queue.splice(idx, 1);
  const th = timeoutHandles.get(socketId);
  if (th) {
    clearTimeout(th);
    timeoutHandles.delete(socketId);
  }
}

function scheduleTimeout(socket: Socket): void {
  const th = setTimeout(() => {
    removeFromQueue(socket.id);
    socket.emit('matchmaking_timeout');
  }, config.MATCHMAKING_TIMEOUT_MS);
  timeoutHandles.set(socket.id, th);
}

export function joinQueue(
  io: Server,
  socket: Socket,
  deviceId: string,
  name: string,
  civId: string,
  rating: number,
  onMatch: (player1: QueuedPlayer, player2: QueuedPlayer) => void
): void {
  const me: QueuedPlayer = {
    socketId: socket.id,
    deviceId,
    name,
    civId,
    rating,
    joinedAt: Date.now(),
  };
  const opponent = findBestOpponent(me);
  if (opponent) {
    const opponentSocket = io.sockets.sockets.get(opponent.socketId);
    console.log('[match] found opponent', me.socketId, 'vs', opponent.socketId, 'opponentSocket:', !!opponentSocket, 'queue was', queue.length);
    if (!opponentSocket) {
      removeFromQueue(opponent.socketId);
      queue.push(me);
      scheduleTimeout(socket);
      return;
    }
    removeFromQueue(opponent.socketId);
    removeFromQueue(me.socketId);
    onMatch(me, opponent);
    return;
  }
  queue.push(me);
  console.log('[match] added to queue', me.socketId, 'queue length', queue.length);
  scheduleTimeout(socket);
}

export function leaveQueue(socketId: string): void {
  removeFromQueue(socketId);
}

/** Deterministic seed for client-side question generation (same for both players) */
export function getQuestionSeed(roomId: string, questionIndex: number): number {
  let h = 0;
  const s = `${roomId}_${questionIndex}`;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

export { getLevelIdForQuestionIndex };
