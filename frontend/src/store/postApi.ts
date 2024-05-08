import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { isEditablePostDescriptionResponse, isEditablePostResponse } from '../types/ServerResponse';
import {
  EditablePost,
  EditablePostDescription,
  ModifiedEditablePost,
  ModifiedEditablePostWithId,
  PostType,
} from '../types/EditablePost';

const editablePostResponseTransformer = (rawResult: unknown) => {
  if (isEditablePostResponse(rawResult)) {
    return rawResult.data;
  }
  throw new Error(`Invalid editable post data response: ${JSON.stringify(rawResult)}`);
};

const editablePostDescriptionResponseTransformer = (rawResult: unknown) => {
  if (isEditablePostDescriptionResponse(rawResult)) {
    return rawResult.data.posts;
  }
  throw new Error(`Invalid editable post data response: ${JSON.stringify(rawResult)}`);
};

export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/post',
    credentials: 'include',
    mode: 'cors',
  }),
  tagTypes: ['post', 'UNAUTHORIZED'],
  endpoints: (builder) => ({
    createPost: builder.mutation<EditablePost, ModifiedEditablePost>({
      query: (newPost) => ({
        url: '/new',
        method: 'POST',
        body: newPost,
      }),
      transformResponse: editablePostResponseTransformer,
      invalidatesTags: ['UNAUTHORIZED', { type: 'post', id: 'home' }],
    }),

    modifyPost: builder.mutation<EditablePost, ModifiedEditablePostWithId>({
      query: (modifiedPost) => ({
        url: `/${modifiedPost.id}`,
        method: 'PATCH',
        body: modifiedPost,
      }),
      transformResponse: editablePostResponseTransformer,
      invalidatesTags: (result) => {
        if (result) {
          return ['UNAUTHORIZED', { type: 'post', id: 'home' }, { type: 'post', id: result.id }];
        }
        return ['UNAUTHORIZED', { type: 'post', id: 'home' }];
      },
    }),

    getHomePost: builder.query<EditablePost, void>({
      query: () => ({
        url: `/home`,
        method: 'GET',
      }),
      transformResponse: editablePostResponseTransformer,
      providesTags: (result) => (result ? [{ type: 'post', id: 'home' }] : ['post']),
    }),

    getPost: builder.query<EditablePost, string>({
      query: (postId) => ({
        url: `/${postId}`,
        method: 'GET',
      }),
      transformResponse: editablePostResponseTransformer,
      providesTags: (result) => (result ? [{ type: 'post', id: result.id }] : ['post']),
    }),

    getPostTypes: builder.query<EditablePostDescription[], PostType>({
      query: (postType) => ({
        url: `/list/${postType}`,
        method: 'GET',
      }),
      transformResponse: editablePostDescriptionResponseTransformer,
      providesTags: (result) => (result ? result.map((post) => ({ type: 'post', id: post.id })) : ['post']),
    }),
  }),
});

export const {
  useCreatePostMutation,
  useModifyPostMutation,
  useGetPostQuery,
  useLazyGetPostQuery,
  useGetHomePostQuery,
  useLazyGetHomePostQuery,
  useGetPostTypesQuery,
  useLazyGetPostTypesQuery,
} = postApi;
