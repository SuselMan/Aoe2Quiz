const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aoe2quiz';

export default {
  PORT,
  MONGODB_URI,
  /** Matchmaking: max wait time (ms) before "no players" */
  MATCHMAKING_TIMEOUT_MS: 2 * 60 * 1000,
  /** Questions per multiplayer game */
  MULTIPLAYER_QUESTION_COUNT: 50,
  /** Seconds per question */
  QUESTION_TIME_SEC: 30,
  /** Starting ELO */
  INITIAL_ELO: 1000,
  /** ELO K-factor */
  ELO_K: 32,
};
