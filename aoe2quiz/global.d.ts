import { GameData } from '@/src/models/dataModel';

declare global {
  interface GlobalType {
    gameData: GameData;
  }
  var globalThis: GlobalType;
  var __DEV__: boolean;
}

export {};
