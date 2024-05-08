import { Request, Response, Router } from 'express';
import { successRes, failRes } from '../../common/serverResponse.js';
import { LoggedInRequest, needsLogin } from '../../middleware/needsLoginMiddleware.js';
import { generateImageUpload } from '../../common/imageUploader.js';
import { asyncWrapper } from '../../common/asyncWrapper.js';
import { handleErrors } from '../../middleware/errorHandlingMiddeware.js';
import { ImageService } from './image.service.js';

const imageUpload = generateImageUpload(1024 * 1024 * 20);

export const imageRouter = Router();

imageRouter.post(
  '/',
  needsLogin,
  imageUpload,
  asyncWrapper(async (req: LoggedInRequest, res: Response) => {
    const addedImageName = await ImageService.uploadImage(req.session.username, req.file);
    if (addedImageName) {
      return res.status(200).json(successRes(addedImageName));
    }
    return res.status(400).send(failRes('Invalid image upload request'));
  })
);

imageRouter.get(
  '/:id',
  asyncWrapper(async (req: Request, res: Response) => {
    const imageStream = await ImageService.getImage(req.params.id);
    if (imageStream) {
      res.status(200);
      return imageStream.pipe(res);
    }
    return res.status(404).send(failRes(`No image with id ${req.params.id}`));
  })
);

imageRouter.use(handleErrors);
