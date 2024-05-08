import { v4 } from 'uuid';
import { EditablePostModel, NewEditablePost, PostType } from './post.schema.js';
import { User, UserModel } from '../user/user.schema.js';

const createNewPost = async (postData: NewEditablePost) => {
  const foundUser = await UserModel.findOne({ username: postData.author });
  if (foundUser) {
    const newPostObject = {
      ...postData,
      author: foundUser,
      created: Date.now(),
      updated: Date.now(),
      id: v4(),
    };
    const newPost = await EditablePostModel.create(newPostObject);
    const savedNewPost = await newPost.save();
    const savedPost = await EditablePostModel.findOne({ id: savedNewPost.id }).populate('author');
    if (savedPost) {
      return savedPost.toObject();
    }
    return null;
  }
  return null;
};

const updatePost = async (id: string, username: string, isAdmin: boolean, postData: NewEditablePost) => {
  const existingPost = await EditablePostModel.findOne({ id }).populate<{ author: User }>('author').lean();
  if (existingPost && existingPost.author) {
    if (username !== existingPost.author.username && !isAdmin) {
      return null;
    }

    const updatePostData = {
      title: postData.title,
      content: postData.content,
      draft: postData.draft,
      alias: postData.alias,
      updated: Date.now(),
    };

    const updatedPost = await EditablePostModel.findOneAndUpdate({ id }, updatePostData, { new: true }).populate<{
      author: User;
    }>('author');
    if (updatedPost) {
      return updatedPost.toObject();
    }
  }
  return null;
};

const getHomePost = async () => {
  const foundPost = await EditablePostModel.findOne({ type: PostType.HOME }).populate('author');
  if (foundPost) {
    return foundPost.toObject();
  }
  return null;
};

const getPostWithId = async (id: string) => {
  const foundPost = await EditablePostModel.findOne({ $or: [{ id }, { alias: id }] }).populate('author');
  if (foundPost) {
    return foundPost.toObject();
  }
  return null;
};

const getLatestPosts = async () => {
  const foundPosts = await EditablePostModel.find({ draft: false })
    .sort('-updated')
    .limit(10)
    .select('title author created updated type id alias')
    .populate('author');
  if (foundPosts) {
    return foundPosts.map((post) => post.toObject());
  }
  return null;
};

const getPostsWithType = async (type: string, limit: number = 0) => {
  const foundPosts = await EditablePostModel.find({ type, draft: false })
    .limit(limit)
    .select('title author created updated type id alias')
    .populate('author');
  if (foundPosts) {
    return foundPosts.map((post) => post.toObject());
  }
  return null;
};

export const PostService = {
  createNewPost,
  updatePost,
  getHomePost,
  getPostWithId,
  getLatestPosts,
  getPostsWithType,
};
