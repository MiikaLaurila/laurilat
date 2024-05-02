import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ServerResponse, isUserResponse } from '../types/ServerResponse';
import { LoginPrompt, NewUserPrompt, User } from '../types/User';

const userResponseTransformer = (rawResult: unknown) => {
  if (isUserResponse(rawResult)) {
    return rawResult.data;
  }
  throw new Error(`Invalid user data response: ${JSON.stringify(rawResult)}`);
};

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'api/v1/user',
    credentials: 'include',
    mode: 'cors',
  }),
  tagTypes: ['user', 'UNAUTHORIZED'],
  endpoints: (builder) => ({
    login: builder.mutation<User, LoginPrompt>({
      query: (loginInfo) => ({
        url: '/login',
        method: 'POST',
        body: loginInfo,
      }),
      transformResponse: userResponseTransformer,
      invalidatesTags: ['UNAUTHORIZED'],
    }),

    logout: builder.mutation<ServerResponse, void>({
      query: () => ({
        url: '/logout',
        method: 'GET',
        credentials: 'include',
      }),
      invalidatesTags: ['user'],
    }),

    userInfo: builder.query<User, void>({
      query: () => ({
        url: '/info',
        method: 'GET',
        credentials: 'include',
      }),
      transformResponse: userResponseTransformer,
      providesTags: (_data, error) => {
        if (error) {
          return ['UNAUTHORIZED'];
        }
        return ['user'];
      },
    }),

    createUser: builder.mutation<ServerResponse, NewUserPrompt>({
      query: (loginInfo) => ({
        url: '/create',
        method: 'POST',
        body: loginInfo,
      }),
    }),

    uploadImage: builder.mutation<User, File>({
      query: (fileData) => {
        const formData = new FormData();
        formData.append('image', fileData);
        return {
          url: '/image',
          method: 'POST',
          credentials: 'include',
          body: formData,
        };
      },
      invalidatesTags: ['user'],
      transformResponse: userResponseTransformer,
    }),

    deleteImage: builder.mutation<User, void>({
      query: () => ({
        url: '/image',
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['user'],
      transformResponse: userResponseTransformer,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useLogoutMutation,
  useUserInfoQuery,
  useUploadImageMutation,
  useDeleteImageMutation,
  useCreateUserMutation,
} = userApi;
