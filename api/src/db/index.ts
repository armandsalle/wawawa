import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate as libsqlMigrator } from "drizzle-orm/libsql/migrator";
import { env } from "../env";
import { logger } from "../logger";

export const dbClient = createClient({
  url: "http://127.0.0.1:8080",
  // authToken: env.TURSO_AUTH_TOKEN,
  syncUrl: env.TURSO_CONNECTION_URL,
  syncInterval: 15,
});

export const db = drizzle(dbClient);

export function migrate(migrationsDir: string) {
  logger.info(
    `will run migrations from '${migrationsDir}' to '${env.TURSO_CONNECTION_URL}'\n`,
  );

  return libsqlMigrator(db, { migrationsFolder: migrationsDir });
}
