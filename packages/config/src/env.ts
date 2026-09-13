export type EnvSource = Record<string, string | undefined>;

export function getEnv(source: EnvSource, key: string): string | undefined {
  const value = source[key];
  return value === undefined || value === '' ? undefined : value;
}

export function getRequiredEnv(source: EnvSource, key: string): string {
  const value = getEnv(source, key);
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getEnvWithDefault(source: EnvSource, key: string, fallback: string): string {
  return getEnv(source, key) ?? fallback;
}
