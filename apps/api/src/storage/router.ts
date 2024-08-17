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
      const { fileName, contentType } = c.req.valid("json");

      const url = await storageService.getSignedUploadUrl({
        fileName,
        contentType,
        userId: c.get("userId"),
      });

      return c.json(url);
    },
  )
  .get("/list-images", async (c) => {
    const userId = c.get("userId");
    const images = await storageService.listImages(userId);

    return c.json(images);
  });
