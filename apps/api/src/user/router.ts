import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";
import { insertUserSchema } from "../user/schema";
import { userStore } from "../user/services";

export const userRouter = new Hono()
  .basePath("/users")
  .get("/", async (c) => {
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
