import pino from "pino";
import { env } from "./env";

export const logger = pino({
  level: env.MODE === "production" ? "info" : "debug",
  transport:
    env.MODE === "production"
      ? undefined
      : {
          target: "pino-pretty",
          options: {
            colorize: true,
            singleLine: true,
          },
        },
});
