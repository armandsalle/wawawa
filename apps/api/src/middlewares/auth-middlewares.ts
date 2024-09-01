import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";
import { logger } from "../logger";
import type { UserRecordType } from "../user/schema";
import { userStore } from "../user/services";

declare module "hono" {
  interface ContextVariableMap {
    clerkUserId: string;
    currentUser: UserRecordType;
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

  c.set("clerkUserId", auth.userId);

  const user = await userStore.byClerkId(auth.userId);

  if (!user) {
    logger.error(`User clerk: ${auth.userId} not found`);
    return c.json(
      {
        message: "User not found.",
      },
      404,
    );
  }

  c.set("currentUser", user);

  await next();
});
