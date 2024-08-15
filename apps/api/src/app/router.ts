import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";
import { userRouter } from "../user/router";

export const appRouter = new Hono()
  .use(
    "*",
    clerkMiddleware({
      secretKey: Bun.env.CLERK_SECRET_KEY,
      publishableKey: Bun.env.CLERK_PUBLISHABLE_KEY,
    }),
  )
  .route("/", userRouter);
