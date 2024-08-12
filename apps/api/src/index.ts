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
 * Create a new Hono app instance.
 */
const app = new Hono({ strict: true });
app.use(
  "/api/*",
  cors({
    origin: isDev
      ? ["http://localhost:5173", "https://api-wawawa.fly.dev"]
      : ["https://api.armand-salle.fr", "https://api-wawawa.fly.dev"],
  }),
);
app.use(honoLogger());

/**
 * Define routes.
 */
app.get("/", (c) => {
  return c.text("OK");
});
app.get("/ping", (c) => {
  return c.text("PONG");
});
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

const route = app.route("/api/v1", appRouter);

/**
 * Run the app.
 */
if (isDev) {
  showRoutes(app, { verbose: true, colorize: true });
}

const port = 3000;
logger.info(`Starting server on port ${port}`);

export default { port, fetch: app.fetch };
export type AppType = typeof route;
