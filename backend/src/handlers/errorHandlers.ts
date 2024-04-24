import { Response } from 'express';
import { MongoError } from 'mongodb';
import { Error } from 'mongoose';
import { environment } from '../utils/env';

export const handleMongooseErrors = (error: unknown, res: Response) => {
  if (environment.NODE_ENV === 'development') {
    console.error(error);
  }

  if (error instanceof Error.ValidationError) {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
      success: false,
      message: 'ValidationError',
      error: messages,
    });
  } else if ((error as MongoError).code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry',
    });
  }
  return res.status(500).json({ success: false, message: 'Internal server error', error });
};
