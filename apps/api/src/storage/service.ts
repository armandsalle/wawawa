import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { S3 } from "../clients/s3";
import { db } from "../db";
import { env } from "../env";
import { logger } from "../logger";
import { documentsTable } from "./schema";

export const storageService = {
  generateStorageKey: (userId: number, fileName: string) => {
    return `${env.MODE}/${userId.toString()}/${fileName}`;
  },

  getStoragePrefix: (userId: number) => {
    return `${env.MODE}/${userId.toString()}/`;
  },

  getSignedUploadUrl: async ({
    fileName,
    contentType,
    userId,
  }: {
    fileName: string;
    contentType: string;
    userId: number;
  }) => {
    const signedUrl = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: storageService.generateStorageKey(userId, fileName),
        ContentType: contentType,
        Metadata: {
          userId: userId.toString(),
        },
      }),
      {
        // 2 minutes
        expiresIn: 86_400,
      },
    );

    return signedUrl;
  },

  getSignedGetObjectUrl: async ({
    fileName,
    userId,
  }: {
    fileName: string;
    userId: number;
  }) => {
    const signedUrl = await getSignedUrl(
      S3,
      new GetObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: storageService.generateStorageKey(userId, fileName),
      }),
      {
        // 2 minutes
        expiresIn: 86_400,
      },
    );

    return signedUrl;
  },

  addDocument: async ({
    userId,
    uri,
    contentType,
  }: {
    userId: number;
    uri: string;
    contentType: string;
  }) => {
    return db
      .insert(documentsTable)
      .values({
        userId,
        uri,
        contentType,
      })
      .returning({
        id: documentsTable.id,
      });
  },

  listImages: async (userId: number) => {
    return await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.userId, userId))
      .limit(100);
  },
  listImagesFromTigris: async (userId: number) => {
    const command = new ListObjectsV2Command({
      Bucket: env.BUCKET_NAME,
      Prefix: storageService.getStoragePrefix(userId),
    });

    const objs = await S3.send(command);

    if (!objs.Contents) {
      return [];
    }

    const res = new Set<{ url: string; contentType?: string }>();
    for (const obj of objs.Contents) {
      if (obj.Key) {
        const objectCommand = new GetObjectCommand({
          Bucket: env.BUCKET_NAME,
          Key: obj.Key,
        });

        const [metadata, signedUrl] = await Promise.allSettled([
          await S3.headObject({
            Bucket: env.BUCKET_NAME,
            Key: obj.Key,
          }),
          await getSignedUrl(S3, objectCommand, {
            expiresIn: 86_400,
          }),
        ]);

        if (metadata.status === "rejected" || signedUrl.status === "rejected") {
          throw new HTTPException(500, { message: "Failed to get signed url" });
        }

        res.add({
          url: signedUrl.value,
          contentType: metadata.value.ContentType,
        });
      }
    }

    return [...res];
  },

  deleteImage: (userId: number, fileName: string) => {
    return db
      .delete(documentsTable)
      .where(
        and(
          eq(documentsTable.userId, userId),
          eq(documentsTable.uri, fileName),
        ),
      );
  },
};
