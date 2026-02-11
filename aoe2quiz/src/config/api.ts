/**
 * Multiplayer server URL.
 * - Set EXPO_PUBLIC_MULTIPLAYER_SERVER_URL in .env (or env) to override.
 * - Dev (__DEV__): defaults to http://localhost:3000.
 * - Production build: defaults to https://5re6.l.time4vps.cloud.
 */
const PRODUCTION_URL = 'https://5re6.l.time4vps.cloud';
const DEV_URL = 'https://5re6.l.time4vps.cloud';

export const MULTIPLAYER_SERVER_URL =
  (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_MULTIPLAYER_SERVER_URL) ||
  (typeof __DEV__ !== 'undefined' && __DEV__ ? DEV_URL : PRODUCTION_URL);
