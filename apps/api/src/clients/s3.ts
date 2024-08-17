import { S3 as S3client } from "@aws-sdk/client-s3";

export const S3 = new S3client({
  region: "auto",
  endpoint: "https://fly.storage.tigris.dev",
});
