import { Client } from 'minio';
import { environment } from '../utils/env.js';

let minioClient: Client | undefined = undefined;

export const minioBuckets = {
  profileImages: 'profile-images',
  images: 'images',
} as const;

export const getMinioClient = () => {
  if (!minioClient) {
    minioClient = new Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: environment.MINIO_USER,
      secretKey: environment.MINIO_PASS,
    });
  }
  return minioClient;
};

export const initializeMinio = async () => {
  console.log('Initializing minio client');
  await ensureBuckets();
  console.log('Minio initialized');
};

const ensureBuckets = async () => {
  const client = getMinioClient();
  Object.values(minioBuckets).forEach(async (bucket) => {
    const bucketExists = await client.bucketExists(bucket);
    console.log(`Check bucket ${bucket} exists:`, bucketExists);
    if (!bucketExists) {
      console.log('Creating missing bucket', bucket);
      client.makeBucket(bucket);
    }
  });
};
