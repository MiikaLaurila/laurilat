import { NextFunction, Request, Response, Router } from 'express';
import multer from 'multer';
import { errorRes, failRes, successRes } from '../../common/serverResponse.js';
import { handleErrors } from '../../handlers/errorHandlers.js';
import { getMinioClient, minioBuckets } from '../../minio/initializeMinio.js';
import { UserModel } from '../models/UserSchema.js';

const imageStorage = multer.memoryStorage();

const imageUpload = (req: Request, res: Response, next: NextFunction) => {
  const uploader = multer({
    storage: imageStorage,
    limits: {
      fileSize: 1024 * 1024 * 20,
    },
  }).single('image');

  uploader(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(errorRes('Failed to parse formdata', err));
    }
    return next();
  });
};

export const imageRouter = Router();

imageRouter.post('/', imageUpload, async (req, res) => {
  if (!req.session.username) {
    return res.status(403).send(failRes('Forbidden'));
  }
  try {
    const foundUser = await UserModel.findOne({ username: req.session.username });
    if (foundUser && req.file) {
      const minioClient = getMinioClient();
      await minioClient.putObject(minioBuckets.images, req.file.originalname, req.file.buffer, req.file.size);
      return res.status(200).json(successRes(req.file.originalname));
    }
    return res.status(500).send(failRes('Unknown error uploading image'));
  } catch (err) {
    return handleErrors(err, res);
  }
});

imageRouter.get('/:id', async (req, res) => {
  try {
    const minioClient = getMinioClient();
    const imageObject = await minioClient.getObject(minioBuckets.images, req.params.id);
    res.status(200);
    return imageObject.pipe(res);
  } catch (err) {
    return handleErrors(err, res);
  }
});
