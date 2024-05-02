import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    if (action.payload) {
      console.error('RTK Query Payload: ', action.payload);
    } else {
      console.error('RTK Query Error: ', action.error);
    }
  }
  return next(action);
};
