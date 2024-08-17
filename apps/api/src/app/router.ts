import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";
import { env } from "../env";
import { storageRouter } from "../storage/router";
import { userRouter } from "../user/router";

export const appRouter = new Hono()
  .use(
    "*",
    clerkMiddleware({
      secretKey: env.CLERK_SECRET_KEY,
      publishableKey: env.CLERK_PUBLISHABLE_KEY,
      jwtKey: env.CLERK_JWT_KEY,
    }),
  )
  .route("/", userRouter)
  .route("/", storageRouter);
