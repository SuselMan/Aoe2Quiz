export const STORAGE_KEYS = {
  language: '@aoe2quiz/language',
  stars: '@aoe2quiz/stars',
  deviceId: '@aoe2quiz/deviceId',
  multiplayerName: '@aoe2quiz/multiplayerName',
  multiplayerCiv: '@aoe2quiz/multiplayerCiv',
  multiplayerRating: '@aoe2quiz/multiplayerRating',
  musicEnabled: '@aoe2quiz/musicEnabled',
  totalGamesPlayed: '@aoe2quiz/totalGamesPlayed',
  supportModalShown: '@aoe2quiz/supportModalShown',
} as const;

export type StarsPayload = Record<string, number>;
