import type { AppType } from "@wawawa/api";
import { hc } from "hono/client";
import { isDev } from "./env";

const client = hc<AppType>(
  isDev ? "http://localhost:3001" : "https://example.com",
);
export const api = client.api.v1;
