import { Router } from 'express';
import {
  DeleteUser,
  DeleteUserValidator,
  LoginUser,
  LoginUserValidator,
  NewUser,
  NewUserValidator,
  UserModel,
} from '../models/UserSchema';
import bodyParser from 'body-parser';
import { comparePassword, hashPassword } from '../helpers/passwords';
import { handleMongooseErrors } from '../../handlers/errorHandlers';
import { environment } from '../../utils/env';
import { errorRes, failRes, successRes } from '../../common/serverResponse';
import { onlyAdmin } from '../../middleware/adminMiddleware';
import { ValidatedResponse, schemaValidator } from '../../middleware/schemaValidator';

export const userRouter = Router();

const jsonParser = bodyParser.json();

userRouter.post(
  '/create',
  jsonParser,
  schemaValidator(NewUserValidator),
  async (req, res: ValidatedResponse<NewUser>) => {
    const isFirstUser = (await UserModel.findOne()) === null;
    if (!isFirstUser && !req.session.admin) {
      return res.status(403).send(failRes('Forbidden'));
    }

    try {
      const newUser = await UserModel.create(res.locals.validatedData);
      newUser.password = await hashPassword(newUser.password);
      const savedUser = await newUser.save();
      return res.status(200).json(successRes(`User '${savedUser.username}' with email '${savedUser.email}' created.`));
    } catch (err) {
      return handleMongooseErrors(err, res);
    }
  }
);

userRouter.delete(
  '/delete',
  jsonParser,
  onlyAdmin,
  schemaValidator(DeleteUserValidator),
  async (req, res: ValidatedResponse<DeleteUser>) => {
    if (res.locals.validatedData.username === req.session.username) {
      return res.status(400).json(failRes('Cannot delete your own user.'));
    }

    try {
      const foundUser = await UserModel.findOne({ username: res.locals.validatedData.username });
      if (foundUser) {
        await foundUser.deleteOne();
        return res.status(200).json(successRes(`Removed user '${foundUser.username}' from system.`));
      } else {
        return res.status(400).json(failRes('User does not exist.'));
      }
    } catch (err) {
      return handleMongooseErrors(err, res);
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
          return res.status(200).json(successRes('Logged in successfully.'));
        }
      }
      return res.status(401).json(failRes('Invalid login information.'));
    } catch (err) {
      return handleMongooseErrors(err, res);
    }
  }
);

userRouter.get('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send(errorRes('Internal server error.', err));
    } else {
      return res.status(200).clearCookie(environment.COOKIE_NAME).json(successRes('Logged out successfully.'));
    }
  });
});
