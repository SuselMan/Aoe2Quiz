import { GameData } from '@/app/models/dataModel';

declare global {
  interface GlobalType {
    gameData: GameData;
  }
  var globalThis: GlobalType;
  var __DEV__: boolean;
}

export {};
