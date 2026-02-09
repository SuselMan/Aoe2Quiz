import { Cost } from '@/src/models/dataModel';
import { Buildings, TechTreeBrunch } from '@/src/const/techTree';
import type { QuestionTypeVariantValue } from '@/src/config/questionTypes';

export type GameState = 'lose' | 'win';

export type GameResult = {
  state: GameState;
  livesLeft: number;
  levelId: string;
  /** 0-3 based on lives left at end */
  stars: number;
};

export type SectionResult = {
  levelId: string;
  stars: number;
};

/** Question variant (from config) for this question */
export type QuestionVariant = QuestionTypeVariantValue;

/** Legacy type for price/civ/tech questions */
export type QType = 'civInfo' | 'buildingPrice' | 'techPrice' | 'unitPrice' | 'civTech' | 'techInfo' | 'treeBrunch';

/** Legacy answer kind for rendering (civ/tech/price/unitStats) */
export type AnswerKind = 'civInfo' | 'buildingPrice' | 'techPrice' | 'unitPrice' | 'civTech' | 'techInfo' | 'treeBrunch' | 'unitStats';

export type Answer = {
  id: string;
  image?: string;
  text?: string;
  statLabel?: string;
  statValue?: number;
  isCorrect: boolean;
  civId?: string;
  techId?: string;
  techName?: string;
  techInfo?: string;
  cost?: Cost;
  unitId?: string;
  buildingId?: string;
  /** For rendering button type (legacy: type) */
  kind?: AnswerKind;
  type?: AnswerKind;
};

export type Question = {
  variant: QuestionVariant;
  /** Legacy: for backward compat with old generators */
  type?: AnswerKind;
  /** Unique key for this question (variant + main entity id) to avoid repeats in one quiz */
  questionKey?: string;
  text: string;
  subText: string | undefined;
  additionalInfo?: string;
  image?: string;
  answers: Answer[];
  tree?: TechTreeBrunch;
  building?: Buildings;
  statKey?: string;
  statValue?: number;
}
