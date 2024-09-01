import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";
import { authMiddleware } from "../middlewares/auth-middlewares";
import { storageService } from "./service";

export const storageRouter = new Hono()
  .use(authMiddleware)
  .basePath("/storage")
  .post(
    "/upload-image-url",
    vValidator(
      "json",
      v.object({
        fileName: v.pipe(v.string(), v.trim(), v.nonEmpty()),
        contentType: v.pipe(v.string(), v.trim(), v.nonEmpty()),
      }),
    ),
    async (c) => {
      const user = c.get("currentUser");

      const { fileName, contentType } = c.req.valid("json");

      const url = await storageService.getSignedUploadUrl({
        fileName,
        contentType,
        userId: user.id,
      });

      return c.json(url);
    },
  )
  .post(
    "/sync-image",
    vValidator(
      "json",
      v.object({
        fileName: v.pipe(v.string(), v.trim(), v.nonEmpty()),
        contentType: v.pipe(v.string(), v.trim(), v.nonEmpty()),
      }),
    ),
    async (c) => {
      const userId = c.get("currentUser").id;
      const { fileName, contentType } = c.req.valid("json");

      await storageService.addDocument({
        userId,
        uri: fileName,
        contentType,
      });

      return c.json({ success: true });
    },
  )
  .get("/list-images", async (c) => {
    const userId = c.get("currentUser").id;

    const images = await storageService.listImages(Number(userId));

    const res: { url: string; contentType: string }[] = [];

    for (const image of images) {
      const url = await storageService.getSignedGetObjectUrl({
        fileName: image.uri,
        userId,
      });

      res.push({
        url,
        contentType: image.contentType,
      });
    }

    return c.json(res);
  });
