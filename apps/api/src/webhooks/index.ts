import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Webhook } from "svix";
import * as v from "valibot";
import { clerkWebhooksClient } from "../clients/clerk";
import { logger } from "../logger";
import { userStore } from "../user/services";

export type ClerkWebhooksBodyRequest = {
  data: {
    backup_code_enabled: boolean;
    banned: boolean;
    create_organization_enabled: boolean;
    created_at: number;
    delete_self_enabled: boolean;
    email_addresses: Array<{
      created_at: number;
      email_address: string;
      id: string;
      object: string;
      reserved: boolean;
      updated_at: number;
      verification: {
        attempts: number;
        expire_at: number;
        status: string;
        strategy: string;
      };
    }>;
    has_image: boolean;
    id: string;
    image_url: string;
    last_active_at: number;
    locked: boolean;
    object: string;
    password_enabled: boolean;
    primary_email_address_id: string;
    profile_image_url: string;
    totp_enabled: boolean;
    two_factor_enabled: boolean;
    updated_at: number;
    username: string;
    verification_attempts_remaining: number;
  };
  event_attributes: {
    http_request: {
      client_ip: string;
      user_agent: string;
    };
  };
  object: string;
  type: string;
};

const parseSchemaClerk = v.object({
  data: v.object({
    created_at: v.number(),
    id: v.string(),
    username: v.string(),
    email_addresses: v.pipe(
      v.array(
        v.object({
          email_address: v.string(),
        }),
      ),
      v.minLength(1),
    ),
  }),
  type: v.string(),
});

export const webhooksRouter = new Hono().post(
  "/clerk",
  vValidator("json", parseSchemaClerk),
  (c) => {
    logger.info("Clerk webhook received");

    // const svix_id = c.req.header("svix-id")?.toString();
    // const svix_timestamp = c.req.header("svix-timestamp")?.toString();
    // const svix_signature = c.req.header("svix-signature")?.toString();
    // const rawBody = await c.req.json();
    // const validBody = c.req.valid("json");

    // if (!svix_id || !svix_timestamp || !svix_signature || !rawBody) {
    //   logger.error("Clerk webhook error: Missing headers or body");
    //   throw new HTTPException(500, {
    //     message: "Clerk webhook error",
    //   });
    // }

    // clerkWebhooksClient.verify(JSON.stringify(rawBody), {
    //   "svix-id": svix_id,
    //   "svix-timestamp": svix_timestamp,
    //   "svix-signature": svix_signature,
    // });

    // if (validBody.type !== "user.created") {
    //   logger.error("Clerk webhook error: Unsupported event type");
    //   return c.json({ message: "Unsupported event type" }, 400);
    // }

    // await userStore.createUser({
    //   name: validBody.data.username,
    //   email: validBody.data.email_addresses[0].email_address,
    //   clerkId: validBody.data.id,
    // });

    // logger.info("New user synced", validBody.data.username);

    // return c.json({ received: true, res: rawBody.type });
    return c.json({ received: true });
  },
);
