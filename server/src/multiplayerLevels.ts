/**
 * Map multiplayer question index (0..49) to difficulty level for progressive difficulty.
 * Same as in app/config/difficulty.ts level ids.
 */
const LEVEL_IDS = [
  'villager', 'militia', 'scout', 'pikeman', 'archer', 'knight', 'cavalier', 'paladin', 'king',
] as const;

const QUESTIONS_PER_LEVEL = 5; // 0-4 villager, 5-9 militia, ...

export function getLevelIdForQuestionIndex(questionIndex: number): string {
  const levelIndex = Math.min(
    Math.floor(questionIndex / QUESTIONS_PER_LEVEL),
    LEVEL_IDS.length - 1
  );
  return LEVEL_IDS[levelIndex];
}
