import { Hono } from "hono";
import { userStore } from "./services";

export const appRouter = new Hono().get("/users", async (c) => {
  const users = await userStore.getUsers();
  return c.json(users);
});
