import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { errorRes } from './serverResponse.js';

export const generateImageUpload = (fileSize: number) => {
  const imageStorage = multer.memoryStorage();
  return (req: Request, res: Response, next: NextFunction) => {
    const uploader = multer({
      storage: imageStorage,
      limits: {
        fileSize,
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
};
