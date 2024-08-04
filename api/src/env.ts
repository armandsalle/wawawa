import { config } from "dotenv";

config({ path: ".env.local" });

function getEnv() {
  const TURSO_CONNECTION_URL = process.env.TURSO_CONNECTION_URL;
  const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

  if (!TURSO_CONNECTION_URL || !TURSO_AUTH_TOKEN) {
    throw new Error("TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN must be set");
  }

  return {
    TURSO_CONNECTION_URL,
    TURSO_AUTH_TOKEN,
    NODE_ENV: process.env.NODE_ENV || "development",
  } as const;
}

export const env = getEnv();
export const isDev = env.NODE_ENV === "development";
