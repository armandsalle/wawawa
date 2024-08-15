import { Hono } from "hono";
import { userRouter } from "../user/router";

export const appRouter = new Hono().route("/", userRouter);
