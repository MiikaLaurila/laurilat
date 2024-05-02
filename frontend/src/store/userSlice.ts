import { createSlice } from '@reduxjs/toolkit';
import { User } from '../types/User';
import { userApi } from './userApi';

interface UserState {
  userInfo: User;
}

const initialState: Partial<UserState> = {} as const;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(userApi.endpoints.login.matchFulfilled, (state, query) => {
        return {
          ...state,
          userInfo: query.payload,
        } as UserState;
      })
      .addMatcher(userApi.endpoints.userInfo.matchFulfilled, (state, query) => {
        return {
          ...state,
          userInfo: query.payload,
        } as UserState;
      })
      .addMatcher(userApi.endpoints.logout.matchFulfilled, (state) => {
        return {
          ...state,
          userInfo: {},
        } as Partial<UserState>;
      });
  },
});
