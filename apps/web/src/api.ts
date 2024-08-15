import type { AppType } from "@wawawa/api";
import { hc } from "hono/client";
import { isDev } from "./env";

const client = hc<AppType>(
  isDev ? "http://localhost:3000" : "https://api.armand-salle.fr",
  {
    headers: {
      "Content-Type": "application/json",
    },
    init: {
      credentials: "include",
      mode: "cors",
      referrer: "",
    },
  },
);

export const api = client.api.v1;
