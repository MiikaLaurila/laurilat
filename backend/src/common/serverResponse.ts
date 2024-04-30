import { ServerResponse } from './models/ServerResponse';

export const successRes = (message: string): ServerResponse => {
  return {
    success: true,
    message,
  };
};

export const failRes = (message: string): ServerResponse => {
  return {
    success: false,
    message,
  };
};

export const errorRes = (message: string, error: unknown): ServerResponse => {
  return {
    success: false,
    message,
    error,
  };
};

export const dataRes = (message: string, data: Record<string, unknown>): ServerResponse => {
  return {
    success: true,
    message,
    data,
  };
};
