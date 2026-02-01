import type { QuestionTypeVariantValue } from './questionTypes';

export type DifficultyLevelId = string;

export type DifficultyLevel = {
  id: DifficultyLevelId;
  /** i18n key for level name (e.g. difficulty.villager) */
  nameKey: string;
  /** Number of questions in this section */
  questionCount: number;
  lives: number;
  /** Which question variants are allowed in this level (easy -> hard) */
  questionVariants: QuestionTypeVariantValue[];
};

/**
 * Difficulty levels 1–9: Villager (easiest) -> King (hardest).
 * Order defines unlock: level N unlocks when level N-1 has >= 1 star.
 *
 * 1) только здания — 10 вопросов
 * 2) здания, юниты — 10 вопросов
 * 3) здания, юниты, технологии — 15 вопросов
 * 4) + особенности цивилизаций — 15 вопросов
 * 5) + уникальные юниты — 20 вопросов
 * 6) + уникальные здания, уникальные технологии (в контенте) — 20 вопросов
 * 7) + ветки технологий — 30 вопросов
 * 8) все типы — 40 вопросов
 * 9) все типы — 100 вопросов
 */
export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    id: 'villager',
    nameKey: 'difficulty.villager',
    questionCount: 10,
    lives: 3,
    questionVariants: [
      'buildingPrice_buildingToPrice',
      'buildingPrice_priceToBuilding',
    ],
  },
  {
    id: 'militia',
    nameKey: 'difficulty.militia',
    questionCount: 10,
    lives: 3,
    questionVariants: [
      'buildingPrice_buildingToPrice',
      'buildingPrice_priceToBuilding',
      'unitPrice_unitToPrice',
      'unitPrice_priceToUnit',
    ],
  },
  {
    id: 'scout',
    nameKey: 'difficulty.scout',
    questionCount: 15,
    lives: 3,
    questionVariants: [
      'buildingPrice_buildingToPrice',
      'buildingPrice_priceToBuilding',
      'unitPrice_unitToPrice',
      'unitPrice_priceToUnit',
      'techPrice_techToPrice',
      'techPrice_priceToTech',
      'techDesc_descToTech',
      'techDesc_techToDesc',
      'civUniqueUnit_unitToCiv',
      'civUniqueUnit_civToUnit',
    ],
  },
  {
    id: 'pikeman',
    nameKey: 'difficulty.pikeman',
    questionCount: 15,
    lives: 3,
    questionVariants: [
      'buildingPrice_buildingToPrice',
      'buildingPrice_priceToBuilding',
      'unitPrice_unitToPrice',
      'unitPrice_priceToUnit',
      'techPrice_techToPrice',
      'techPrice_priceToTech',
      'techDesc_descToTech',
      'techDesc_techToDesc',
      'civBonus_bonusToCiv',
      'civBonus_civToBonus',
      'civTeamBonus_bonusToCiv',
      'civTeamBonus_civToBonus',
      'civUniqueUnit_unitToCiv',
      'civUniqueUnit_civToUnit',
    ],
  },
  {
    id: 'archer',
    nameKey: 'difficulty.archer',
    questionCount: 20,
    lives: 3,
    questionVariants: [
      'buildingPrice_buildingToPrice',
      'buildingPrice_priceToBuilding',
      'unitPrice_unitToPrice',
      'unitPrice_priceToUnit',
      'techPrice_techToPrice',
      'techPrice_priceToTech',
      'techDesc_descToTech',
      'techDesc_techToDesc',
      'civBonus_bonusToCiv',
      'civBonus_civToBonus',
      'civTeamBonus_bonusToCiv',
      'civTeamBonus_civToBonus',
      'civUniqueUnit_unitToCiv',
      'civUniqueUnit_civToUnit',
    ],
  },
  {
    id: 'knight',
    nameKey: 'difficulty.knight',
    questionCount: 20,
    lives: 3,
    questionVariants: [
      'buildingPrice_buildingToPrice',
      'buildingPrice_priceToBuilding',
      'unitPrice_unitToPrice',
      'unitPrice_priceToUnit',
      'techPrice_techToPrice',
      'techPrice_priceToTech',
      'techDesc_descToTech',
      'techDesc_techToDesc',
      'civBonus_bonusToCiv',
      'civBonus_civToBonus',
      'civTeamBonus_bonusToCiv',
      'civTeamBonus_civToBonus',
      'civUniqueUnit_unitToCiv',
      'civUniqueUnit_civToUnit',
    ],
  },
  {
    id: 'cavalier',
    nameKey: 'difficulty.monk',
    questionCount: 30,
    lives: 3,
    questionVariants: [
      'buildingPrice_buildingToPrice',
      'buildingPrice_priceToBuilding',
      'unitPrice_unitToPrice',
      'unitPrice_priceToUnit',
      'techPrice_techToPrice',
      'techPrice_priceToTech',
      'techDesc_descToTech',
      'techDesc_techToDesc',
      'civBonus_bonusToCiv',
      'civBonus_civToBonus',
      'civTeamBonus_bonusToCiv',
      'civTeamBonus_civToBonus',
      'civUniqueUnit_unitToCiv',
      'civUniqueUnit_civToUnit',
      'treeBranch_branchToCiv',
    ],
  },
  {
    id: 'paladin',
    nameKey: 'difficulty.paladin',
    questionCount: 40,
    lives: 3,
    questionVariants: [
      'buildingPrice_buildingToPrice',
      'buildingPrice_priceToBuilding',
      'unitPrice_unitToPrice',
      'unitPrice_priceToUnit',
      'techPrice_techToPrice',
      'techPrice_priceToTech',
      'techDesc_descToTech',
      'techDesc_techToDesc',
      'civBonus_bonusToCiv',
      'civBonus_civToBonus',
      'civTeamBonus_bonusToCiv',
      'civTeamBonus_civToBonus',
      'civUniqueUnit_unitToCiv',
      'civUniqueUnit_civToUnit',
      'treeBranch_branchToCiv',
      'unitStats_statsToUnit',
      'unitStats_unitToStat',
    ],
  },
  {
    id: 'king',
    nameKey: 'difficulty.king',
    questionCount: 100,
    lives: 3,
    questionVariants: [
      'buildingPrice_buildingToPrice',
      'buildingPrice_priceToBuilding',
      'unitPrice_unitToPrice',
      'unitPrice_priceToUnit',
      'techPrice_techToPrice',
      'techPrice_priceToTech',
      'techDesc_descToTech',
      'techDesc_techToDesc',
      'civBonus_bonusToCiv',
      'civBonus_civToBonus',
      'civTeamBonus_bonusToCiv',
      'civTeamBonus_civToBonus',
      'civUniqueUnit_unitToCiv',
      'civUniqueUnit_civToUnit',
      'treeBranch_branchToCiv',
      'unitStats_statsToUnit',
      'unitStats_unitToStat',
    ],
  },
];

export const getDifficultyLevelById = (id: DifficultyLevelId): DifficultyLevel | undefined =>
  DIFFICULTY_LEVELS.find((l) => l.id === id);

export const getDifficultyLevelIndex = (id: DifficultyLevelId): number =>
  DIFFICULTY_LEVELS.findIndex((l) => l.id === id);

