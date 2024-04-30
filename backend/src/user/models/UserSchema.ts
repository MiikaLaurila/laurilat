import { InferSchemaType, Schema, model } from 'mongoose';
import { object, string, boolean } from 'yup';

export const NewUserValidator = object({
  username: string().required(),
  name: string().required(),
  email: string().email().required(),
  password: string().required().min(8, 'Password must be at least 8 characters'),
  admin: boolean().required(),
});

export type NewUser = ReturnType<typeof NewUserValidator.validateSync>;

export const LoginUserValidator = object({
  username: string().required(),
  password: string().required(),
});

export type LoginUser = ReturnType<typeof LoginUserValidator.validateSync>;

export const DeleteUserValidator = object({
  username: string().required(),
});

export type DeleteUser = ReturnType<typeof DeleteUserValidator.validateSync>;

export const UserSchema = new Schema({
  username: { type: String, required: true, trim: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validator:
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    trim: true,
  },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true },
});

export type User = InferSchemaType<typeof UserSchema>;

export const UserModel = model<User>('User', UserSchema);
