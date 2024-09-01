import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth-middlewares";
import { userStore } from "../user/services";

export const userRouter = new Hono()
  .use(authMiddleware)
  .basePath("/users")
  .get("/me", async (c) => {
    const user = c.get("currentUser");

    return c.json({
      user,
    });
  })

  .get("/", async (c) => {
    const users = await userStore.getUsers();
    return c.json(users);
  });
