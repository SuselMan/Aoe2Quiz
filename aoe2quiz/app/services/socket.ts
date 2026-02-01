import { io, type Socket } from 'socket.io-client';
import { MULTIPLAYER_SERVER_URL } from '@/app/config/api';

export type MatchFoundPayload = {
  roomId: string;
  opponent: { name: string; civId: string; rating: number };
  you: { name: string; civId: string; rating: number };
};

export type QuestionPayload = {
  questionIndex: number;
  levelId: string;
  seed: number;
  timeSec: number;
};

export type GameOverPayload = {
  result: 'win_a' | 'win_b' | 'draw';
  youWon: boolean;
  yourRatingChange: number;
  newRating: number;
  opponent: { name: string; civId: string; rating: number };
};

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(MULTIPLAYER_SERVER_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      socket.onAny((event, ...args) => {
        console.log('[socket] event received:', event, args.length ? args[0] : '');
      });
    }
  }
  return socket;
}

/** Subscribe to socket connection state (connect/disconnect). Returns unsubscribe. */
export function subscribeToConnection(cb: (connected: boolean) => void): () => void {
  const s = getSocket();
  const onConnect = () => cb(true);
  const onDisconnect = () => cb(false);
  s.on('connect', onConnect);
  s.on('disconnect', onDisconnect);
  cb(s.connected);
  return () => {
    s.off('connect', onConnect);
    s.off('disconnect', onDisconnect);
  };
}

/**
 * Emit join_queue only when socket is connected, so the server always receives it.
 */
export function joinQueue(deviceId: string, name: string, civId: string, onSearching?: () => void): void {
  const s = getSocket();
  const doJoin = () => {
    s.emit('join_queue', { deviceId, name, civId });
    onSearching?.();
  };
  if (s.connected) {
    doJoin();
  } else {
    s.once('connect', doJoin);
  }
}

export function leaveQueue(): void {
  getSocket().emit('leave_queue');
}

export function sendReady(roomId: string): void {
  getSocket().emit('ready', { roomId });
}

export function sendAnswer(roomId: string, correct: boolean): void {
  getSocket().emit('answer', { roomId, correct });
}

export function onMatchFound(cb: (data: MatchFoundPayload) => void): () => void {
  const s = getSocket();
  s.on('match_found', cb);
  return () => s.off('match_found', cb);
}

export function onMatchmakingTimeout(cb: () => void): () => void {
  const s = getSocket();
  s.on('matchmaking_timeout', cb);
  return () => s.off('matchmaking_timeout', cb);
}

export function onQuestion(cb: (data: QuestionPayload) => void): () => void {
  const s = getSocket();
  s.on('question', cb);
  return () => s.off('question', cb);
}

export function onGameOver(cb: (data: GameOverPayload) => void): () => void {
  const s = getSocket();
  s.on('game_over', cb);
  return () => s.off('game_over', cb);
}

export function onError(cb: (err: { message: string }) => void): () => void {
  const s = getSocket();
  s.on('error', cb);
  return () => s.off('error', cb);
}
