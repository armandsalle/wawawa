import { getAuth } from "@hono/clerk-auth";
import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import * as v from "valibot";
import { logger } from "../logger";
import { insertUserSchema } from "../user/schema";
import { userStore } from "../user/services";

declare module "hono" {
  interface ContextVariableMap {
    userId: string;
  }
}

export const userRouter = new Hono()
  .use(async (c, next) => {
    const cookies = getCookie(c);
    console.log(cookies);
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
    logger.info(`User ${auth.userId} is accessing the user API`);

    await next();
  })
  .basePath("/users")
  .get("/me", async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({
        message: "You are not logged in.",
      });
    }

    return c.json({
      message: "You are logged in!",
      userId: auth.userId,
    });
  })

  .get("/", async (c) => {
    const userId = c.get("userId");
    logger.info(`User ${userId} is fetching users`);
    const users = await userStore.getUsers();
    return c.json(users);
  })

  .post("/", vValidator("json", insertUserSchema), async (c) => {
    const user = await userStore.createUser(c.req.valid("json"));
    return c.json(user, 201);
  })

  .delete(
    "/:id",
    vValidator(
      "param",
      v.object({
        id: v.pipe(v.string(), v.trim(), v.transform(Number), v.number()),
      }),
    ),
    async (c) => {
      await userStore.deleteUser(c.req.valid("param").id);
      return c.json({}, 204);
    },
  );
