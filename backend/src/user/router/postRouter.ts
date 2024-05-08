import bodyParser from 'body-parser';
import { Router } from 'express';
import { ValidatedResponse, schemaValidator } from '../../middleware/schemaValidator.js';
import {
  EditablePostModel,
  NewEditablePostValidator,
  NewEditablePost,
  PostType,
} from '../models/EditablePostSchema.js';
import { User, UserModel } from '../models/UserSchema.js';
import { dataRes, failRes } from '../../common/serverResponse.js';
import { v4 } from 'uuid';
import { handleErrors } from '../../handlers/errorHandlers.js';

export const postRouter = Router();
const jsonParser = bodyParser.json();

postRouter.post(
  '/new',
  jsonParser,
  schemaValidator(NewEditablePostValidator),
  async (req, res: ValidatedResponse<NewEditablePost>) => {
    if (!req.session.username) {
      return res.status(403).send(failRes('Unauthorized'));
    }
    try {
      const foundUser = await UserModel.findOne({ username: res.locals.validatedData.author });
      if (foundUser) {
        const newPostObject = {
          ...res.locals.validatedData,
          author: foundUser,
          created: Date.now(),
          updated: Date.now(),
          id: v4(),
        };
        const newPost = await EditablePostModel.create(newPostObject);
        const savedNewPost = await newPost.save();
        const savedPost = await EditablePostModel.findOne({ id: savedNewPost.id }).populate('author');
        if (savedPost) {
          return res.status(200).json(dataRes(`Successfully saved post with id ${savedPost.id}`, savedPost.toObject()));
        } else {
          return res.status(500).json(failRes('Internal Server Error'));
        }
      }
      return res.status(401).json(failRes('Invalid author'));
    } catch (err) {
      return handleErrors(err, res);
    }
  }
);

postRouter.patch(
  '/:id',
  jsonParser,
  schemaValidator(NewEditablePostValidator),
  async (req, res: ValidatedResponse<NewEditablePost>) => {
    if (!req.session.username) {
      return res.status(403).send(failRes('Unauthorized'));
    }
    try {
      const existingPost = await EditablePostModel.findOne({ id: req.params.id })
        .populate<{ author: User }>('author')
        .lean();
      if (existingPost && existingPost.author) {
        if (req.session.username !== existingPost.author.username && !req.session.admin) {
          return res.status(403).send(failRes('Only author of post or admin can modify posts'));
        }

        const updatePostData = {
          content: res.locals.validatedData.content,
          draft: res.locals.validatedData.draft,
          updated: Date.now(),
        };

        const updatedPost = await EditablePostModel.findOneAndUpdate({ id: req.params.id }, updatePostData).populate<{
          author: User;
        }>('author');
        if (updatedPost) {
          return res
            .status(200)
            .json(dataRes(`Successfully updated post with id ${updatedPost.id}`, updatedPost.toObject()));
        }
      }

      return res.status(404).json(failRes(`No post with id ${req.params.id}`));
    } catch (err) {
      return handleErrors(err, res);
    }
  }
);

postRouter.get('/home', async (_, res) => {
  try {
    const foundPost = await EditablePostModel.findOne({ type: PostType.HOME }).populate('author');
    if (foundPost) {
      return res.status(200).json(dataRes(`Get post with type ${PostType.HOME}`, foundPost.toObject()));
    }
    return res.status(404).json(failRes(`No post with type ${PostType.HOME}`));
  } catch (err) {
    return handleErrors(err, res);
  }
});

postRouter.get('/:id', async (req, res) => {
  try {
    const foundPost = await EditablePostModel.findOne({ id: req.params.id });
    if (foundPost) {
      return res.status(200).json(dataRes(`Get post with id ${req.params.id}`, foundPost.toObject()));
    }
    return res.status(404).json(failRes(`No post with id ${req.params.id}`));
  } catch (err) {
    return handleErrors(err, res);
  }
});
