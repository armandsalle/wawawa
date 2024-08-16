function getEnv() {
  const TURSO_CONNECTION_URL = process.env.TURSO_CONNECTION_URL;
  const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
  const MODE = process.env.NODE_ENV;
  const TURSO_ENCRYPTION_KEY = process.env.TURSO_ENCRYPTION_KEY;
  const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
  const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;
  const CLERK_JWT_KEY = process.env.CLERK_JWT_KEY;

  if (!MODE) {
    throw new Error("MODE must be set");
  }

  if (!TURSO_CONNECTION_URL || !TURSO_AUTH_TOKEN) {
    throw new Error("TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN must be set");
  }

  if (!TURSO_ENCRYPTION_KEY) {
    throw new Error("TURSO_ENCRYPTION_KEY must be set");
  }

  if (!CLERK_SECRET_KEY || !CLERK_PUBLISHABLE_KEY) {
    throw new Error("CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY must be set");
  }

  if (!CLERK_JWT_KEY) {
    throw new Error("CLERK_JWT_KEY must be set");
  }

  return {
    TURSO_CONNECTION_URL,
    TURSO_AUTH_TOKEN,
    TURSO_ENCRYPTION_KEY,
    MODE,
    CLERK_SECRET_KEY,
    CLERK_PUBLISHABLE_KEY,
    CLERK_JWT_KEY,
  } as const;
}

export const env = getEnv();
export const isDev = env.MODE === "development";
export const isProd = env.MODE === "production";
