import { getMinioClient, minioBuckets } from '../../minio/initializeMinio.js';
import { UserModel } from '../user/user.schema.js';

const uploadImage = async (username?: string, file?: Express.Multer.File) => {
  if (!username || !file) return null;
  const foundUser = await UserModel.findOne({ username });
  if (foundUser) {
    const minioClient = getMinioClient();
    await minioClient.putObject(minioBuckets.images, file.originalname, file.buffer, file.size);
    return file.originalname;
  }
  return null;
};

const getImage = async (id: string) => {
  const minioClient = getMinioClient();
  const imageObject = await minioClient.getObject(minioBuckets.images, id);
  if (imageObject) {
    return imageObject;
  }
  return null;
};

export const ImageService = { uploadImage, getImage };
