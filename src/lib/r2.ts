import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const PART_SIZE_BYTES = 10 * 1024 * 1024;

const getRequiredEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

export const getR2Client = () => {
  const accountId = getRequiredEnv("CF_R2_ACCOUNT_ID");
  const accessKeyId = getRequiredEnv("CF_R2_ACCESS_KEY_ID");
  const secretAccessKey = getRequiredEnv("CF_R2_SECRET_ACCESS_KEY");

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
};

const sanitizeFileName = (fileName: string) =>
  fileName.trim().replace(/[^a-zA-Z0-9._-]+/g, "-");

const buildObjectKey = (fileName: string) => {
  const safeName = sanitizeFileName(fileName);
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
  return `videos/${timestamp}-${safeName}`;
};

export const getPublicUrl = (key: string) => {
  const baseUrl = process.env.CF_R2_PUBLIC_BASE_URL;
  if (baseUrl) {
    return `${baseUrl.replace(/\/$/, "")}/${key}`;
  }
  const accountId = getRequiredEnv("CF_R2_ACCOUNT_ID");
  const bucket = getRequiredEnv("CF_R2_BUCKET_NAME");
  return `https://${bucket}.${accountId}.r2.cloudflarestorage.com/${key}`;
};

export const generatePresignedUrl = async (fileName: string, contentType: string) => {
  const bucket = getRequiredEnv("CF_R2_BUCKET_NAME");
  const client = getR2Client();
  const key = buildObjectKey(fileName);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 3600 });

  return {
    key,
    url,
    publicUrl: getPublicUrl(key),
  };
};

export const initiateMultipartUpload = async (
  fileName: string,
  contentType: string,
  size: number
) => {
  const bucket = getRequiredEnv("CF_R2_BUCKET_NAME");
  const client = getR2Client();
  const key = buildObjectKey(fileName);
  const partCount = Math.ceil(size / PART_SIZE_BYTES);

  if (partCount > 10000) {
    throw new Error("File too large for multipart upload");
  }

  const createCommand = new CreateMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const { UploadId } = await client.send(createCommand);
  if (!UploadId) {
    throw new Error("Failed to initiate multipart upload");
  }

  const parts = await Promise.all(
    Array.from({ length: partCount }, async (_, index) => {
      const partNumber = index + 1;
      const uploadPartCommand = new UploadPartCommand({
        Bucket: bucket,
        Key: key,
        UploadId,
        PartNumber: partNumber,
      });

      const url = await getSignedUrl(client, uploadPartCommand, { expiresIn: 3600 });
      return { partNumber, url };
    })
  );

  return {
    key,
    uploadId: UploadId,
    partSize: PART_SIZE_BYTES,
    parts,
    publicUrl: getPublicUrl(key),
  };
};

export const completeMultipartUpload = async (
  key: string,
  uploadId: string,
  parts: { partNumber: number; etag: string }[]
) => {
  const bucket = getRequiredEnv("CF_R2_BUCKET_NAME");
  const client = getR2Client();

  const completeCommand = new CompleteMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts.map((part) => ({
        PartNumber: part.partNumber,
        ETag: part.etag,
      })),
    },
  });

  await client.send(completeCommand);

  return { publicUrl: getPublicUrl(key) };
};
