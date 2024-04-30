import { Response } from 'express';
import { MongoError } from 'mongodb';
import { Error } from 'mongoose';
import { environment } from '../utils/env';
import { errorRes } from '../common/serverResponse';

export const handleMongooseErrors = (error: unknown, res: Response) => {
  if (environment.NODE_ENV === 'development') {
    console.error(error);
  }

  if (error instanceof Error.ValidationError) {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json(errorRes('ValidationError', messages));
  } else if ((error as MongoError).code === 11000) {
    return res.status(400).json(errorRes('Duplicate Entry', error));
  }
  return res.status(500).json(errorRes('Internal Server Error', error));
};
