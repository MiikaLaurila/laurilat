import { Types } from 'mongoose';
import { AnyObject } from 'yup';

export const cleanObject = <T>(object: T & { _id: Types.ObjectId }, optional?: Array<keyof T>) => {
  const newObj = { ...object } as unknown as AnyObject;
  delete newObj._id;

  if ('__v' in newObj) {
    delete newObj['__v'];
  }

  if (optional) {
    for (const key of optional) {
      if ((newObj as T)[key]) {
        delete (newObj as T)[key];
      }
    }
  }

  return newObj as Partial<T>;
};
