import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger as honoLogger } from "hono/logger";
import { appRouter } from "./app/router";
import { migrate } from "./db";
import { isDev } from "./env";
import { migrationsDir } from "./helpers";
import { logger } from "./logger";

/**
 * Migrate the database before starting the server.
 */
await migrate(migrationsDir);

/**
 * Create a new Hono app and define a route.
 */
const app = new Hono({ strict: true });
app.use(
  "/api/*",
  cors({
    origin: isDev ? "*" : "*",
  }),
);
app.use(honoLogger());

const route = app.route("/api/v1", appRouter);

if (isDev) {
  showRoutes(app, { verbose: true, colorize: true });
}

const port = 3000;
logger.info(`Starting server on port ${port}`);

export default serve({ port, fetch: app.fetch });
export type AppType = typeof route;
