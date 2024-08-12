import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate as libsqlMigrator } from "drizzle-orm/libsql/migrator";
import { env, isDev } from "../env";
import { logger } from "../logger";

export const dbClient = isDev
  ? createClient({
      url: env.TURSO_CONNECTION_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    })
  : createClient({
      syncUrl: env.TURSO_CONNECTION_URL,
      authToken: env.TURSO_AUTH_TOKEN,
      url: "file:replica.db",
      syncInterval: 15,
      encryptionKey: env.TURSO_ENCRYPTION_KEY,
    });

export const db = drizzle(dbClient);

export function migrate(migrationsDir: string) {
  logger.info(
    `will run migrations from '${migrationsDir}' to '${env.TURSO_CONNECTION_URL}'\n`,
  );

  return libsqlMigrator(db, { migrationsFolder: migrationsDir });
}
