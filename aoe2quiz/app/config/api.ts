/**
 * Multiplayer server URL. Change for production.
 */
export const MULTIPLAYER_SERVER_URL =
  typeof __DEV__ !== 'undefined' && __DEV__
    ? 'http://localhost:3000'
    : 'http://localhost:3000';
