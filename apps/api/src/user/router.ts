import { Hono } from "hono";
import { logger } from "../logger";
import { authMiddleware } from "../middlewares/auth-middlewares";
import { userStore } from "../user/services";

export const userRouter = new Hono()
  .use(authMiddleware)
  .basePath("/users")
  .get("/me", async (c) => {
    const userId = c.get("userId");

    const user = await userStore.byClerkId(userId);

    if (!user) {
      logger.error(`User ${userId} not found`);
      return c.json(
        {
          message: "User not found.",
        },
        404,
      );
    }

    return c.json({
      user,
    });
  })

  .get("/", async (c) => {
    const users = await userStore.getUsers();
    return c.json(users);
  });
