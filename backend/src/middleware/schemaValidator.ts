import { AnyObject, ObjectSchema } from 'yup';
import { Request, Response, NextFunction, Locals } from 'express';
import { errorRes } from '../common/serverResponse.js';
import { ServerResponse as ServerResponseJson } from '../common/models/ServerResponse.js';
import { ServerResponse } from 'http';

export interface ValidatedResponse<T> extends Response<ServerResponseJson, Locals & { validatedData: T }> {
  locals: {
    validatedData: T;
  };
}

const validateWithSchema = <T extends AnyObject>(
  schema: ObjectSchema<T, AnyObject, unknown, ''>,
  data: unknown,
  res: Response
): T | Response => {
  try {
    return schema.validateSync(data) as T;
  } catch (err) {
    return res.status(400).json(errorRes('ValidationError', err.message));
  }
};

export const schemaValidator = <T extends AnyObject>(schema: ObjectSchema<T, AnyObject, unknown, ''>) => {
  return (req: Request, res: Response<ServerResponse, { validatedData: T }>, next: NextFunction) => {
    const validatedData = validateWithSchema(schema, req.body, res);
    if (validatedData instanceof ServerResponse) {
      return res;
    }
    res.locals.validatedData = validatedData;
    return next();
  };
};
