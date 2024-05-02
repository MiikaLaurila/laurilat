import { Client } from 'minio';
import { environment } from '../utils/env';

let minioClient: Client | undefined = undefined;

export const minioBuckets = {
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

export const initializeMinio = () => {
  console.log('Initializing minio client');
  ensureBuckets();
};

const ensureBuckets = () => {
  const client = getMinioClient();
  Object.values(minioBuckets).forEach((bucket) => {
    const bucketExists = client.bucketExists(bucket);
    if (!bucketExists) {
      console.log('Creating missing bucket', bucket);
      client.makeBucket(bucket);
    }
  });
};
