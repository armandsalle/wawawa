import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger as honoLogger } from "hono/logger";
import { appRouter } from "./app/router";
import { migrate } from "./db";
import { isDev } from "./env";
import { migrationsDir } from "./helpers";
import { logger } from "./logger";
import { webhooksRouter } from "./webhooks";

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
      : [
          "https://api.armand-salle.fr",
          "https://api-wawawa.fly.dev",
          "https://wawawa.pages.dev",
          "https://wawawa.armand-salle.fr",
        ],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
  }),
);
app.use(honoLogger());

/**
 * Define routes.
 */
app
  .get("/", (c) => {
    return c.text("OK");
  })
  .get("/ping", (c) => {
    return c.text("PONG");
  })
  .get("/health", (c) => {
    return c.json({ status: "ok" });
  })
  .route("/webhooks", webhooksRouter);

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
