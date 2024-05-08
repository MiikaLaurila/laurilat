import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userApi } from './userApi';
import { rtkQueryErrorLogger } from './errorLogger';
import { userSlice } from './userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { editableSlice } from './editableSlice';
import { postApi } from './postApi';
import { imageApi } from './imageApi';

export const rootStore = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
    userStore: userSlice.reducer,
    editableStore: editableSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, postApi.middleware, imageApi.middleware, rtkQueryErrorLogger),
});

export type RootState = ReturnType<typeof rootStore.getState>;
export type AppDispatch = typeof rootStore.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

setupListeners(rootStore.dispatch);
