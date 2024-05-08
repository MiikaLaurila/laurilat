import bodyParser from 'body-parser';
import { Router } from 'express';
import { NewEditablePostValidator, NewEditablePost } from './post.schema.js';
import { PostService } from './post.service.js';
import { asyncWrapper } from '../../common/asyncWrapper.js';
import { dataRes, failRes } from '../../common/serverResponse.js';
import { handleErrors } from '../../middleware/errorHandlingMiddeware.js';
import { needsLogin, LoggedInRequest } from '../../middleware/needsLoginMiddleware.js';
import { schemaValidator, ValidatedResponse } from '../../middleware/schemaValidator.js';

export const postRouter = Router();
const jsonParser = bodyParser.json();

postRouter.post(
  '/new',
  needsLogin,
  jsonParser,
  schemaValidator(NewEditablePostValidator),
  asyncWrapper(async (_req, res: ValidatedResponse<NewEditablePost>) => {
    const newPost = await PostService.createNewPost(res.locals.validatedData);
    if (newPost) {
      return res.status(200).json(dataRes(`Successfully saved post with id ${newPost.id}`, newPost));
    }
    return res.status(400).json(failRes('Invalid post data'));
  })
);

postRouter.patch(
  '/:id',
  needsLogin,
  jsonParser,
  schemaValidator(NewEditablePostValidator),
  asyncWrapper(async (req: LoggedInRequest, res: ValidatedResponse<NewEditablePost>) => {
    const updatedPost = await PostService.updatePost(
      req.params.id,
      req.session.username,
      req.session.admin,
      res.locals.validatedData
    );
    if (updatedPost) {
      return res.status(200).json(dataRes(`Successfully updated post with id ${updatedPost.id}`, updatedPost));
    }
    return res.status(400).json(failRes(`Failed to update post`));
  })
);

postRouter.get(
  '/home',
  asyncWrapper(async (_, res) => {
    const foundPost = await PostService.getHomePost();
    if (foundPost) {
      return res.status(200).json(dataRes(`Get home page post`, foundPost));
    }
    return res.status(404).json(failRes(`No home page post`));
  })
);

postRouter.get(
  '/:id',
  asyncWrapper(async (req, res) => {
    const foundPost = await PostService.getPostWithId(req.params.id);
    if (foundPost) {
      return res.status(200).json(dataRes(`Get post with id ${req.params.id}`, foundPost));
    }
    return res.status(404).json(failRes(`No post with id ${req.params.id}`));
  })
);

postRouter.get(
  '/list/latest',
  asyncWrapper(async (_req, res) => {
    const posts = await PostService.getLatestPosts();
    if (posts) {
      return res.status(200).json(dataRes(`Get 10 latest posts`, { posts }));
    }
    return res.status(404).json(failRes(`No posts`));
  })
);

postRouter.get(
  '/list/:type',
  asyncWrapper(async (req, res) => {
    const posts = await PostService.getPostsWithType(req.params.type);
    if (posts) {
      return res.status(200).json(dataRes(`Get posts with type ${req.params.type}`, { posts }));
    }
    return res.status(404).json(failRes(`No posts with type ${req.params.type}`));
  })
);

postRouter.use(handleErrors);
