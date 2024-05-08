import { Router } from 'express';
import { userRouter } from './endpoints/user/user.router.js';
import { postRouter } from './endpoints/post/post.router.js';
import { imageRouter } from './endpoints/image/image.router.js';

export const v1Router = Router();

v1Router.use('/user', userRouter);
v1Router.use('/post', postRouter);
v1Router.use('/image', imageRouter);
