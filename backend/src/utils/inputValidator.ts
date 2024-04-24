import { AnyObject, ObjectSchema, ValidationError } from 'yup';
import { Response } from 'express';
// eslint-disable-next-line
export const validateWithSchema = async <T extends AnyObject>(
  schema: ObjectSchema<T, AnyObject, unknown, ''>,
  data: unknown,
  res: Response
): Promise<T | Response> => {
  return (schema.validate(data) as unknown as Promise<T | Response>).catch((err: ValidationError) => {
    return res.status(400).json({
      success: false,
      message: 'ValidationError',
      error: err.message,
    });
  });
};
