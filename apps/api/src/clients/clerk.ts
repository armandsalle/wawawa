import { createClerkClient } from "@clerk/backend";
import { Webhook } from "svix";
import { env } from "../env";

export const clerk = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
  publishableKey: env.CLERK_PUBLISHABLE_KEY,
  jwtKey: env.CLERK_JWT_KEY,
});

export const clerkWebhooksClient = new Webhook(env.CLERK_WEBHOOK_SECRET);
