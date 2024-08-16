import { Clerk } from "@clerk/clerk-js";
import type { AppType } from "@wawawa/api";
import { hc } from "hono/client";
import { isDev } from "./env";

export const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export const clerk = new Clerk(PUBLISHABLE_KEY);

export const api = async () => {
  await clerk.load();
  const token = await clerk.session?.getToken();

  const client = hc<AppType>(
    isDev ? "http://localhost:3000" : "https://api.armand-salle.fr",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      init: {
        mode: "cors",
      },
    },
  );

  return client.api.v1;
};

export type APIClient = Awaited<ReturnType<typeof api>>;
