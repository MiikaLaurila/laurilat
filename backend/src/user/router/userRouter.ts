import { NextFunction, Request, Response, Router } from 'express';
import {
  DeleteUser,
  DeleteUserValidator,
  LoginUser,
  LoginUserValidator,
  NewUser,
  NewUserValidator,
  UserModel,
} from '../models/UserSchema.js';
import bodyParser from 'body-parser';
import { comparePassword, hashPassword } from '../helpers/passwords.js';
import { handleErrors } from '../../handlers/errorHandlers.js';
import { environment } from '../../utils/env.js';
import { dataRes, errorRes, failRes, successRes } from '../../common/serverResponse.js';
import { onlyAdmin } from '../../middleware/adminMiddleware.js';
import { ValidatedResponse, schemaValidator } from '../../middleware/schemaValidator.js';
import { getMinioClient, minioBuckets } from '../../minio/initializeMinio.js';
import multer from 'multer';

export const userRouter = Router();

const imageStorage = multer.memoryStorage();

const imageUpload = (req: Request, res: Response, next: NextFunction) => {
  const uploader = multer({
    storage: imageStorage,
    limits: {
      fileSize: 1024 * 1024 * 2,
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

const jsonParser = bodyParser.json();

userRouter.post(
  '/create',
  jsonParser,
  schemaValidator(NewUserValidator),
  async (req, res: ValidatedResponse<NewUser>) => {
    const isFirstUser = (await UserModel.findOne().lean()) === null;
    if (!isFirstUser && !req.session.admin) {
      return res.status(403).send(failRes('Forbidden'));
    }

    try {
      const newUser = await UserModel.create(res.locals.validatedData);
      newUser.password = await hashPassword(newUser.password);
      const savedUser = await newUser.save();
      return res.status(200).json(successRes(`User '${savedUser.username}' with email '${savedUser.email}' created`));
    } catch (err) {
      return handleErrors(err, res);
    }
  }
);

userRouter.delete(
  '/delete',
  onlyAdmin,
  jsonParser,
  schemaValidator(DeleteUserValidator),
  async (req, res: ValidatedResponse<DeleteUser>) => {
    if (res.locals.validatedData.username === req.session.username) {
      return res.status(400).json(failRes('Cannot delete your own user'));
    }

    try {
      const foundUser = await UserModel.findOne({ username: res.locals.validatedData.username });
      if (foundUser) {
        await foundUser.deleteOne();
        return res.status(200).json(successRes(`Removed user '${foundUser.username}' from system`));
      } else {
        return res.status(400).json(failRes('User does not exist'));
      }
    } catch (err) {
      return handleErrors(err, res);
    }
  }
);

userRouter.post(
  '/login',
  jsonParser,
  schemaValidator(LoginUserValidator),
  async (req, res: ValidatedResponse<LoginUser>) => {
    try {
      const foundUser = await UserModel.findOne({ username: res.locals.validatedData.username });
      if (foundUser) {
        const correctPassword = await comparePassword(res.locals.validatedData.password, foundUser.password);
        if (correctPassword) {
          req.session.username = foundUser.username;
          req.session.admin = foundUser.admin;
          return res.status(200).json(dataRes('Logged in successfully', foundUser.toObject()));
        }
      }
      return res.status(401).json(failRes('Invalid login information'));
    } catch (err) {
      return handleErrors(err, res);
    }
  }
);

userRouter.get('/info', async (req, res) => {
  if (!req.session.username) {
    return res.status(403).send(failRes('Forbidden'));
  }
  try {
    const foundUser = await UserModel.findOne({ username: req.session.username });
    if (foundUser) {
      return res.status(200).json(dataRes(`Info of user ${req.session.username}`, foundUser.toObject()));
    }
    return res.status(500).send(failRes('Unknown error finding user'));
  } catch (err) {
    return handleErrors(err, res);
  }
});

userRouter.get('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send(errorRes('Internal server error', err));
    } else {
      return res.status(200).clearCookie(environment.COOKIE_NAME).json(successRes('Logged out successfully'));
    }
  });
});

userRouter.post('/image', imageUpload, async (req, res) => {
  if (!req.session.username) {
    return res.status(403).send(failRes('Forbidden'));
  }
  try {
    const foundUser = await UserModel.findOne({ username: req.session.username });
    if (foundUser && req.file) {
      const minioClient = getMinioClient();
      await minioClient.putObject(minioBuckets.profileImages, req.file.originalname, req.file.buffer, req.file.size);
      foundUser.profileImage = req.file.originalname;
      const savedUser = foundUser.save();
      return res.status(200).json(dataRes(`Profile image updated`, (await savedUser).toObject()));
    }
    return res.status(500).send(failRes('Unknown error uploading profile image'));
  } catch (err) {
    return handleErrors(err, res);
  }
});

userRouter.delete('/image', async (req, res) => {
  if (!req.session.username) {
    return res.status(403).send(failRes('Forbidden'));
  }
  try {
    const foundUser = await UserModel.findOne({ username: req.session.username });
    if (foundUser) {
      foundUser.profileImage = '';
      const savedUser = foundUser.save();
      return res.status(200).json(dataRes(`Profile image removed`, (await savedUser).toObject()));
    }
    return res.status(500).send(failRes('Unknown error removing profile image'));
  } catch (err) {
    return handleErrors(err, res);
  }
});

userRouter.get('/image/:user', async (req, res) => {
  try {
    const foundUser = await UserModel.findOne({ username: req.params.user }).lean({ versionKey: false });
    if (foundUser) {
      const minioClient = getMinioClient();
      const imageObject = await minioClient.getObject(minioBuckets.profileImages, foundUser.profileImage);
      res.status(200);
      return imageObject.pipe(res);
    }
    return res.status(500).send(failRes('Unknown error fetching profile image'));
  } catch (err) {
    return handleErrors(err, res);
  }
});
