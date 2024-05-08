import { Response } from 'express';
import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { environment } from '../utils/env.js';
import { errorRes } from '../common/serverResponse.js';
import { InvalidObjectNameError } from 'minio';

export const handleErrors = (error: unknown, res: Response) => {
  if (environment.NODE_ENV === 'development') {
    console.error(error);
  }

  if (error instanceof MongooseError.ValidationError) {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json(errorRes('ValidationError', messages));
  } else if ((error as MongoError).code === 11000) {
    return res.status(400).json(errorRes('Duplicate Entry', error));
  } else if (error instanceof InvalidObjectNameError) {
    return res.status(404).json(errorRes('Object not found', error));
  }
  return res.status(500).json(errorRes('Internal Server Error', error));
};
