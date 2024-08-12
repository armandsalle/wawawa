function getEnv() {
  const TURSO_CONNECTION_URL = process.env.TURSO_CONNECTION_URL;
  const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
  const MODE = process.env.NODE_ENV;
  const TURSO_ENCRYPTION_KEY = process.env.TURSO_ENCRYPTION_KEY;

  if (!MODE) {
    throw new Error("MODE must be set");
  }

  if (!TURSO_CONNECTION_URL || !TURSO_AUTH_TOKEN) {
    throw new Error("TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN must be set");
  }

  if (!TURSO_ENCRYPTION_KEY) {
    throw new Error("TURSO_ENCRYPTION_KEY must be set");
  }

  return {
    TURSO_CONNECTION_URL,
    TURSO_AUTH_TOKEN,
    TURSO_ENCRYPTION_KEY,
    MODE,
  } as const;
}

export const env = getEnv();
export const isDev = env.MODE === "development";
export const isProd = env.MODE === "production";
