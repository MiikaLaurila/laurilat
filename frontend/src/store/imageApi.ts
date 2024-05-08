import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { isServerResponse } from '../types/ServerResponse';

const imagePostResponseTransformer = (rawResult: unknown) => {
  if (isServerResponse(rawResult)) {
    return rawResult.message;
  }
  throw new Error(`Invalid image post response: ${JSON.stringify(rawResult)}`);
};

export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/image',
    credentials: 'include',
    mode: 'cors',
  }),
  tagTypes: ['UNAUTHORIZED'],
  endpoints: (builder) => ({
    uploadImage: builder.mutation<string, File>({
      query: (fileData) => {
        const formData = new FormData();
        formData.append('image', fileData);
        return {
          url: '/',
          method: 'POST',
          credentials: 'include',
          body: formData,
        };
      },
      transformResponse: imagePostResponseTransformer,
      invalidatesTags: ['UNAUTHORIZED'],
    }),
  }),
});

export const { useUploadImageMutation } = imageApi;
