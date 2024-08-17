import { config } from "dotenv";

config({
  path: ".env.local",
});

function getEnv() {
  const MODE = process.env.NODE_ENV;

  const TURSO_CONNECTION_URL = process.env.TURSO_CONNECTION_URL;
  const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
  const TURSO_ENCRYPTION_KEY = process.env.TURSO_ENCRYPTION_KEY;

  const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
  const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;
  const CLERK_JWT_KEY = process.env.CLERK_JWT_KEY;
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
  const AWS_ENDPOINT_URL_S3 = process.env.AWS_ENDPOINT_URL_S3;
  const AWS_REGION = process.env.AWS_REGION;
  const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
  const BUCKET_NAME = process.env.BUCKET_NAME;

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

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error("CLERK_WEBHOOK_SECRET must be set");
  }

  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set");
  }

  if (!AWS_ENDPOINT_URL_S3 || !AWS_REGION) {
    throw new Error("AWS_ENDPOINT_URL_S3 and AWS_REGION must be set");
  }

  if (!BUCKET_NAME) {
    throw new Error("BUCKET_NAME must be set");
  }

  return {
    TURSO_CONNECTION_URL,
    TURSO_AUTH_TOKEN,
    TURSO_ENCRYPTION_KEY,
    MODE,
    CLERK_SECRET_KEY,
    CLERK_PUBLISHABLE_KEY,
    CLERK_JWT_KEY,
    CLERK_WEBHOOK_SECRET,
    AWS_ACCESS_KEY_ID,
    AWS_ENDPOINT_URL_S3,
    AWS_REGION,
    AWS_SECRET_ACCESS_KEY,
    BUCKET_NAME,
  } as const;
}

export const env = getEnv();
export const isDev = env.MODE === "development";
export const isProd = env.MODE === "production";
