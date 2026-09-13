export { GameSdkError } from './errors';
export { type GameSDK, type GameSDKConfig, createGameSDK } from './game-sdk';
export { type HttpClient, createHttpClient } from './http';
export {
  GAME_FINISHED_MESSAGE,
  type GameFinishedMessage,
  buildGameFinishedMessage,
  reportGameResult,
} from './report';
export type {
  GameDefinition,
  GameResult,
  GameSession,
  PlayRecord,
  Player,
  UserProgress,
} from '@game-platform/types';
