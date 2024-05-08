import { Router } from 'express';
import { userRouter } from './user/router/userRouter.js';
import { postRouter } from './user/router/postRouter.js';
import { imageRouter } from './user/router/imageRouter.js';

export const v1Router = Router();

v1Router.use('/user', userRouter);
v1Router.use('/post', postRouter);
v1Router.use('/image', imageRouter);
