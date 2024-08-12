import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { insertUserSchema } from "./schema";
import { userStore } from "./services";

export const appRouter = new Hono()
  .get("/users", async (c) => {
    const users = await userStore.getUsers();
    return c.json(users);
  })
  .post("/users", vValidator("json", insertUserSchema), async (c) => {
    const user = await userStore.createUser(c.req.valid("json"));
    return c.json(user, 201);
  });
