import type { Server, Socket } from 'socket.io';
import config from './config';
import { getNewRatings } from './elo';
import { Player } from './models/Player';
import { joinQueue, leaveQueue, getQuestionSeed, getLevelIdForQuestionIndex } from './matchmaking';
import type { QueuedPlayer } from './matchmaking';

type GameResult = 'win_a' | 'win_b' | 'draw';

interface RoomPlayer {
  socketId: string;
  deviceId: string;
  name: string;
  civId: string;
  rating: number;
}

interface GameRoom {
  roomId: string;
  playerA: RoomPlayer;
  playerB: RoomPlayer;
  questionIndex: number;
  answerA: boolean | null;
  answerB: boolean | null;
  gameOver: boolean;
  result: GameResult | null;
  /** Both players must emit 'ready' before first question is sent */
  readyA: boolean;
  readyB: boolean;
}

const rooms = new Map<string, GameRoom>();
const socketToRoom = new Map<string, string>();
const socketToPlayerSlot = new Map<string, 'A' | 'B'>();
const questionTimers = new Map<string, NodeJS.Timeout>();

function getRoom(roomId: string): GameRoom | undefined {
  return rooms.get(roomId);
}

function clearQuestionTimer(roomId: string): void {
  const t = questionTimers.get(roomId);
  if (t) {
    clearTimeout(t);
    questionTimers.delete(roomId);
  }
}

function emitToRoom(io: Server, roomId: string, event: string, payload: unknown): void {
  io.to(roomId).emit(event, payload);
}

function nextQuestion(io: Server, room: GameRoom): void {
  clearQuestionTimer(room.roomId);
  const { roomId, questionIndex } = room;
  if (questionIndex >= config.MULTIPLAYER_QUESTION_COUNT) {
    room.gameOver = true;
    room.result = 'draw';
    finishGame(io, room);
    return;
  }
  room.answerA = null;
  room.answerB = null;
  const levelId = getLevelIdForQuestionIndex(questionIndex);
  const seed = getQuestionSeed(roomId, questionIndex);
  emitToRoom(io, roomId, 'question', {
    questionIndex,
    levelId,
    seed,
    timeSec: config.QUESTION_TIME_SEC,
  });
  const t = setTimeout(() => {
    questionTimers.delete(roomId);
    const r = getRoom(roomId);
    if (!r || r.gameOver) return;
    if (r.answerA === null && r.answerB === null) {
      r.gameOver = true;
      r.result = 'draw';
      finishGame(io, r);
      return;
    }
    if (r.answerA === null) {
      r.gameOver = true;
      r.result = 'win_b';
      finishGame(io, r);
      return;
    }
    if (r.answerB === null) {
      r.gameOver = true;
      r.result = 'win_a';
      finishGame(io, r);
      return;
    }
  }, config.QUESTION_TIME_SEC * 1000);
  questionTimers.set(roomId, t);
}

function finishGame(io: Server, room: GameRoom): void {
  const result = room.result!;
  (async () => {
    const [playerA, playerB] = await Promise.all([
      Player.findOne({ deviceId: room.playerA.deviceId }),
      Player.findOne({ deviceId: room.playerB.deviceId }),
    ]);
    const ratingA = playerA?.rating ?? config.INITIAL_ELO;
    const ratingB = playerB?.rating ?? config.INITIAL_ELO;
    const { ratingA: ratingANew, ratingB: ratingBNew } = getNewRatings(
      ratingA,
      ratingB,
      result === 'win_a' ? 'win_a' : result === 'win_b' ? 'win_b' : 'draw'
    );
    await Player.updateOne({ deviceId: room.playerA.deviceId }, { rating: ratingANew });
    await Player.updateOne({ deviceId: room.playerB.deviceId }, { rating: ratingBNew });

    const payloadA = {
      result,
      youWon: result === 'win_a',
      yourRatingChange: ratingANew - ratingA,
      newRating: ratingANew,
      opponent: room.playerB,
    };
    const payloadB = {
      result,
      youWon: result === 'win_b',
      yourRatingChange: ratingBNew - ratingB,
      newRating: ratingBNew,
      opponent: room.playerA,
    };
    io.to(room.playerA.socketId).emit('game_over', payloadA);
    io.to(room.playerB.socketId).emit('game_over', payloadB);

    clearQuestionTimer(room.roomId);
    rooms.delete(room.roomId);
    socketToRoom.delete(room.playerA.socketId);
    socketToRoom.delete(room.playerB.socketId);
    socketToPlayerSlot.delete(room.playerA.socketId);
    socketToPlayerSlot.delete(room.playerB.socketId);
  })();
}

function onAnswer(io: Server, roomId: string, slot: 'A' | 'B', correct: boolean): void {
  const room = getRoom(roomId);
  if (!room || room.gameOver) return;
  if (slot === 'A') room.answerA = correct;
  else room.answerB = correct;

  const a = room.answerA;
  const b = room.answerB;
  if (a !== null && b !== null) {
    if (!a && !b) {
      room.gameOver = true;
      room.result = 'draw';
      finishGame(io, room);
      return;
    }
    if (!a) {
      room.gameOver = true;
      room.result = 'win_b';
      finishGame(io, room);
      return;
    }
    if (!b) {
      room.gameOver = true;
      room.result = 'win_a';
      finishGame(io, room);
      return;
    }
    room.questionIndex += 1;
    nextQuestion(io, room);
  }
}

function onDisconnect(io: Server, socketId: string): void {
  const roomId = socketToRoom.get(socketId);
  if (!roomId) {
    leaveQueue(socketId);
    return;
  }
  const room = getRoom(roomId);
  if (!room) return;
  room.gameOver = true;
  const slot = socketToPlayerSlot.get(socketId);
  room.result = slot === 'A' ? 'win_b' : 'win_a';
  finishGame(io, room);
}

export function createRoom(io: Server, player1: QueuedPlayer, player2: QueuedPlayer): string {
  const roomId = `room_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const room: GameRoom = {
    roomId,
    playerA: {
      socketId: player1.socketId,
      deviceId: player1.deviceId,
      name: player1.name,
      civId: player1.civId,
      rating: player1.rating,
    },
    playerB: {
      socketId: player2.socketId,
      deviceId: player2.deviceId,
      name: player2.name,
      civId: player2.civId,
      rating: player2.rating,
    },
    questionIndex: 0,
    answerA: null,
    answerB: null,
    gameOver: false,
    result: null,
    readyA: false,
    readyB: false,
  };
  rooms.set(roomId, room);
  socketToRoom.set(player1.socketId, roomId);
  socketToRoom.set(player2.socketId, roomId);
  socketToPlayerSlot.set(player1.socketId, 'A');
  socketToPlayerSlot.set(player2.socketId, 'B');
  return roomId;
}

function onReady(io: Server, roomId: string, slot: 'A' | 'B'): void {
  const room = getRoom(roomId);
  if (!room || room.gameOver) return;
  if (slot === 'A') room.readyA = true;
  else room.readyB = true;
  if (room.readyA && room.readyB) {
    console.log('[match] both ready, sending first question', roomId);
    nextQuestion(io, room);
  }
}

function doOnMatch(io: Server, p1: QueuedPlayer, p2: QueuedPlayer): void {
  const socket1 = io.sockets.sockets.get(p1.socketId);
  const socket2 = io.sockets.sockets.get(p2.socketId);
  console.log('[match] onMatch', p1.socketId, p2.socketId, 'sockets:', !!socket1, !!socket2);
  if (!socket1 || !socket2) return;
  const roomId = createRoom(io, p1, p2);
  const room = getRoom(roomId)!;
  socket1.join(roomId);
  socket2.join(roomId);
  const payload1 = {
    roomId,
    opponent: { name: room.playerB.name, civId: room.playerB.civId, rating: room.playerB.rating },
    you: { name: room.playerA.name, civId: room.playerA.civId, rating: room.playerA.rating },
  };
  const payload2 = {
    roomId,
    opponent: { name: room.playerA.name, civId: room.playerA.civId, rating: room.playerA.rating },
    you: { name: room.playerB.name, civId: room.playerB.civId, rating: room.playerB.rating },
  };
  socket1.emit('match_found', payload1);
  socket2.emit('match_found', payload2);
  console.log('[match] match_found emitted to', p1.socketId, p2.socketId);
}

export function registerSocketHandlers(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log('[match] connection', socket.id);
    socket.on('join_queue', (data: { deviceId: string; name: string; civId: string }) => {
      const { deviceId, name, civId } = data;
      console.log('[match] join_queue', socket.id, name);
      if (!deviceId || !name || !civId) {
        socket.emit('error', { message: 'deviceId, name, civId required' });
        return;
      }
      // Fetch rating from DB (and update name/civId), then add to queue with actual rating
      Player.findOne({ deviceId })
        .then((player) => {
          const rating = player?.rating ?? config.INITIAL_ELO;
          if (!player) {
            Player.create({ deviceId, name, civId, rating: config.INITIAL_ELO }).catch(() => {});
          } else {
            Player.updateOne({ deviceId }, { name, civId }).catch(() => {});
          }
          joinQueue(io, socket, deviceId, name, civId, rating, doOnMatch.bind(null, io));
        })
        .catch(() => {
          joinQueue(io, socket, deviceId, name, civId, config.INITIAL_ELO, doOnMatch.bind(null, io));
        });
    });

    socket.on('leave_queue', () => {
      leaveQueue(socket.id);
    });

    socket.on('ready', (data: { roomId: string }) => {
      const { roomId } = data;
      const slot = socketToPlayerSlot.get(socket.id);
      if (!slot) return;
      onReady(io, roomId, slot);
    });

    socket.on('answer', (data: { roomId: string; correct: boolean }) => {
      const { roomId, correct } = data;
      const slot = socketToPlayerSlot.get(socket.id);
      if (!slot) return;
      onAnswer(io, roomId, slot, correct);
    });

    socket.on('disconnect', () => {
      onDisconnect(io, socket.id);
    });
  });
}
