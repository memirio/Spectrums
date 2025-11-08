import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const bucket = process.env.STORAGE_BUCKET!;
const region = process.env.STORAGE_REGION!;
const endpoint = process.env.STORAGE_ENDPOINT;
const cdnBase = process.env.CDN_BASE_URL!;

export const s3 = new S3Client({
  region,
  endpoint,
  forcePathStyle: !!endpoint,
  credentials: endpoint ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  } : undefined,
});

export async function uploadBuffer(key: string, body: Buffer, contentType: string): Promise<string> {
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    ACL: endpoint ? undefined : 'public-read',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  return `${cdnBase}/${key}`;
}

export async function exists(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

