export class GameSdkError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'GameSdkError';
    this.status = status;
  }
}
