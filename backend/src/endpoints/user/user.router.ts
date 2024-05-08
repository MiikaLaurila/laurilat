import { Request, Response, Router } from 'express';
import {
  DeleteUser,
  DeleteUserValidator,
  LoginUser,
  LoginUserValidator,
  NewUser,
  NewUserValidator,
} from './user.schema.js';
import bodyParser from 'body-parser';
import { asyncWrapper } from '../../common/asyncWrapper.js';
import { generateImageUpload } from '../../common/imageUploader.js';
import { failRes, successRes, dataRes, errorRes } from '../../common/serverResponse.js';
import { handleErrors } from '../../middleware/errorHandlingMiddeware.js';
import { needsAdmin } from '../../middleware/needsAdminMiddleware.js';
import { needsLogin } from '../../middleware/needsLoginMiddleware.js';
import { schemaValidator, ValidatedResponse } from '../../middleware/schemaValidator.js';
import { environment } from '../../utils/env.js';
import { UserService } from './user.service.js';

export const userRouter = Router();

const imageUpload = generateImageUpload(1024 * 1024 * 2);

const jsonParser = bodyParser.json();

userRouter.post(
  '/create',
  needsLogin,
  jsonParser,
  schemaValidator(NewUserValidator),
  asyncWrapper(async (req: Request, res: ValidatedResponse<NewUser>) => {
    if ((await UserService.systemHasUsers()) && !req.session.admin) {
      return res.status(403).send(failRes('Forbidden'));
    }

    const savedUser = await UserService.createUser(res.locals.validatedData);
    return res.status(200).json(successRes(`User '${savedUser.username}' with email '${savedUser.email}' created`));
  })
);

userRouter.delete(
  '/delete',
  needsLogin,
  needsAdmin,
  jsonParser,
  schemaValidator(DeleteUserValidator),
  asyncWrapper(async (req: Request, res: ValidatedResponse<DeleteUser>) => {
    const username = res.locals.validatedData.username;
    if (username === req.session.username) {
      return res.status(400).json(failRes('Cannot delete your own user'));
    }

    if (await UserService.deleteUser(username)) {
      return res.status(200).json(successRes(`Removed user '${username}' from system`));
    }
    return res.status(400).json(failRes('User does not exist'));
  })
);

userRouter.post(
  '/login',
  jsonParser,
  schemaValidator(LoginUserValidator),
  asyncWrapper(async (req: Request, res: ValidatedResponse<LoginUser>) => {
    const loggedInUser = await UserService.loginUser(res.locals.validatedData);
    if (loggedInUser) {
      req.session.username = loggedInUser.username;
      req.session.admin = loggedInUser.admin;

      return res.status(200).json(dataRes('Logged in successfully', loggedInUser));
    }
    return res.status(401).json(failRes('Invalid login information'));
  })
);

userRouter.get(
  '/info',
  needsLogin,
  asyncWrapper(async (req: Request, res: Response) => {
    const foundUser = await UserService.getUserInfo(req.session.username);
    if (foundUser) {
      return res.status(200).json(dataRes(`Info of user ${req.session.username}`, foundUser));
    }
    return res.status(400).send(failRes('Invalid user info request'));
  })
);

userRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send(errorRes('Internal server error', err));
    } else {
      return res.status(200).clearCookie(environment.COOKIE_NAME).json(successRes('Logged out successfully'));
    }
  });
});

userRouter.post(
  '/image',
  needsLogin,
  imageUpload,
  asyncWrapper(async (req: Request, res: Response) => {
    const updatedUser = await UserService.updateProfileImage(req.session.username, req.file);
    if (updatedUser) {
      return res.status(200).json(dataRes(`Profile image updated`, updatedUser));
    }
    return res.status(400).send(failRes('Invalid profile image adding request'));
  })
);

userRouter.delete(
  '/image',
  needsLogin,
  asyncWrapper(async (req: Request, res: Response) => {
    const updatedUser = await UserService.deleteProfileImage(req.session.username);
    if (updatedUser) {
      return res.status(200).json(dataRes(`Profile image removed`, updatedUser));
    }
    return res.status(400).send(failRes('Invalid profile image deletion request'));
  })
);

userRouter.get(
  '/image/:user',
  asyncWrapper(async (req: Request, res: Response) => {
    const imageStream = await UserService.getProfileImage(req.params.user);
    if (imageStream) {
      res.status(200);
      return imageStream.pipe(res);
    }
    return res.status(400).send(failRes('Invalid profile image fetch request'));
  })
);

userRouter.use(handleErrors);
