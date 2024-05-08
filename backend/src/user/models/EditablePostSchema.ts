/* eslint-disable @typescript-eslint/indent */
import deepmerge from 'deepmerge';
import { InferSchemaType, Schema, Types, model } from 'mongoose';
import { object, string, mixed, array, boolean } from 'yup';
import rehypeParse from 'rehype-parse';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';

enum EditableType {
  HEADING = 'heading',
  HEADING2 = 'heading2',
  HEADING3 = 'heading3',
  PARAGRAPH = 'paragraph',
  IMAGE = 'image',
  LIST = 'list',
}

export enum PostType {
  HOME = 'home',
  PEOPLE = 'people',
  FOOD = 'food',
  GAMES = 'games',
  SPORTS = 'sports',
  OTHER = 'other',
}

const rehypeSchema = deepmerge(defaultSchema, { attributes: { '*': ['style'] } });
const rehypeTransformer = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize, rehypeSchema)
  .use(rehypeStringify);

export const EditableValidator = object({
  type: mixed<EditableType>().oneOf(Object.values(EditableType)).required(),
  content: string()
    .required()
    .transform((value) => {
      return rehypeTransformer.processSync(value).value.toString();
    }),
  id: string().required(),
  meta: object().notRequired(),
});

export type ValidEditable = ReturnType<typeof EditableValidator.validateSync>;

export const NewEditablePostValidator = object({
  content: array().of(EditableValidator).required(),
  author: string().required(),
  type: mixed<PostType>().oneOf(Object.values(PostType)).required(),
  draft: boolean().required().default(false),
});

export type NewEditablePost = ReturnType<typeof NewEditablePostValidator.validateSync>;

export const EditableSchema = new Schema(
  {
    type: { type: String, enum: EditableType, required: true },
    content: { type: String, required: true },
    id: { type: String, required: true },
    meta: { type: Object, required: false },
  },
  {
    toObject: {
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const EditablePostSchema = new Schema(
  {
    content: [EditableSchema],
    author: { type: Types.ObjectId, ref: 'User', required: true },
    created: { type: Number, required: true },
    updated: { type: Number, required: true },
    type: { type: String, enum: PostType, required: true },
    draft: { type: Boolean, required: true },
    id: { type: String, required: true },
  },
  {
    toObject: {
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        ret.author = ret.author.username;
        return ret;
      },
    },
  }
);

export type Editable = InferSchemaType<typeof EditableSchema>;

export const EditableModel = model<Editable>('Editable', EditableSchema);

export type EditablePost = InferSchemaType<typeof EditablePostSchema>;

export const EditablePostModel = model<EditablePost>('EditablePost', EditablePostSchema);
