import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate as libsqlMigrator } from "drizzle-orm/libsql/migrator";
import { env } from "../env";
import { logger } from "../logger";

const client = createClient({
  url: env.TURSO_CONNECTION_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client);

export function migrate(migrationsDir: string) {
  logger.info(
    `will run migrations from '${migrationsDir}' to '${env.TURSO_CONNECTION_URL}'\n`,
  );

  return libsqlMigrator(db, { migrationsFolder: migrationsDir });
}
