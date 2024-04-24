import { Router } from 'express';
import { LoginUserValidator, NewUserValidator, UserModel } from '../models/UserSchema';
import bodyParser from 'body-parser';
import { comparePassword, hashPassword } from '../helpers/passwords';
import { handleMongooseErrors } from '../../handlers/errorHandlers';
import { validateWithSchema } from '../../utils/inputValidator';
import { environment } from '../../utils/env';
import { ServerResponse } from 'http';

export const userRouter = Router();

const jsonParser = bodyParser.json();

userRouter.post('/create', jsonParser, async (req, res) => {
  const isFirstUser = (await UserModel.findOne()) === null;
  if (!isFirstUser && !req.session.admin) {
    return res.status(401).send({
      success: false,
      message: 'Unauthorized',
    });
  }

  const userInput = req.body;
  const newUserData = await validateWithSchema(NewUserValidator, userInput, res);
  if (newUserData instanceof ServerResponse) {
    return res;
  }

  try {
    const newUser = await UserModel.create(newUserData);
    newUser.password = await hashPassword(newUser.password);
    const savedUser = await newUser.save();
    return res.status(200).json({
      success: true,
      message: `User ${savedUser.username} with email ${savedUser.email} created.`,
    });
  } catch (err) {
    return handleMongooseErrors(err, res);
  }
});

userRouter.post('/login', jsonParser, async (req, res) => {
  const userInput = req.body;
  const loginData = await validateWithSchema(LoginUserValidator, userInput, res);
  if (loginData instanceof ServerResponse) {
    return res;
  }

  try {
    const foundUser = await UserModel.findOne({ username: loginData.username });
    if (foundUser) {
      const correctPassword = await comparePassword(loginData.password, foundUser.password);
      if (correctPassword) {
        req.session.username = foundUser.username;
        req.session.admin = foundUser.admin;
        return res.status(200).json({
          success: true,
          message: 'Logged in successfully',
        });
      }
    }
    return res.status(404).json({
      success: false,
      message: 'Invalid login information',
    });
  } catch (err) {
    return handleMongooseErrors(err, res);
  }
});

userRouter.get('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ success: false, message: 'Internal server error', err });
    } else {
      return res.status(200).clearCookie(environment.COOKIE_NAME).json({
        success: true,
        message: 'Logged out successfully',
      });
    }
  });
});
