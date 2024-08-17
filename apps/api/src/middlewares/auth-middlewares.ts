import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";

declare module "hono" {
  interface ContextVariableMap {
    userId: string;
  }
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json(
      {
        message: "You are not logged in.",
      },
      401,
    );
  }
  c.set("userId", auth.userId);
  await next();
});
