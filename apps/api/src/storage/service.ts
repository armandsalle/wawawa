import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "../clients/s3";
import { env } from "../env";

export const storageService = {
  getSignedUploadUrl: async ({
    fileName,
    contentType,
    userId,
  }: {
    fileName: string;
    contentType: string;
    userId: string;
  }) => {
    const signedUrl = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: `${userId}/${fileName}`,
        ContentType: contentType,
        Metadata: {
          userId,
        },
      }),
      {
        // 2 minutes
        expiresIn: 86_400,
      },
    );

    return signedUrl;
  },

  listImages: async (userId: string) => {
    const command = new ListObjectsV2Command({
      Bucket: env.BUCKET_NAME,
      Prefix: `${userId}/`,
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

        const metadata = await S3.headObject({
          Bucket: env.BUCKET_NAME,
          Key: obj.Key,
        });
        console.log(metadata);

        const signedUrl = await getSignedUrl(S3, objectCommand, {
          expiresIn: 86_400,
        });

        res.add({
          url: signedUrl,
          contentType: metadata.ContentType,
        });
      }
    }

    return [...res];
  },
};
