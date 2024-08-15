import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";
import { userRouter } from "../user/router";

export const appRouter = new Hono()
  .use("*", clerkMiddleware())
  .route("/", userRouter);
