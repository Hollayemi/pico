import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['User'],
    endpoints: (builder) => ({
 
      // Register
      cart: builder.mutation({
        query: (cardData) => ({
          url: '/user/cart',
          method: 'POST',
          data: cardData,
        }),
      }),
      getUser: builder.query({
        query: () => ({
          url: '/user/get-account',
          method: 'GET',
        }),
        invalidatesTags: ['User'],
      }),
      // Verify OTP
      saveItem: builder.mutation({
        query: (data) => ({
          url: '/user/save-item',
          method: 'POST',
          data: data,
        }),
      }),
  
      // Resend OTP
      viewProduct: builder.mutation({
        query: (data) => ({
          url: '/user/view',
          method: 'POST',
          data,
        }),
      }),

      order: builder.mutation({
        query: (data) => ({
          url: '/user/order',
          method: 'POST',
          data,
        }),
      }),
  
      // Forgot Password
      userUpdate: builder.mutation({
        query: (email) => ({
          url: '/user/update',
          method: 'POST',
          data: { email },
        }),
      }),
  
      // Reset Password
      updatePicture: builder.mutation({
        query: (resetData) => ({
          url: '/user/update-picture',
          method: 'POST',
          data: resetData,
        }),
      }),
  
      
    }),
  });
  
  export const {
    useUpdatePictureMutation,
    useGetUserQuery,
  } = userApi;

