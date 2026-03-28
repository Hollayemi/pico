import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['User'],
    endpoints: (builder) => ({

        // POST /auth/login
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                data: credentials,
            }),
            invalidatesTags: ['User'],
            onQueryStarted: async (_, { queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.token) {
                        localStorage.setItem('user_token', data.token);
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),

        // POST /auth/logout
        logout: builder.mutation({
            query: () => ({ url: '/auth/logout', method: 'POST' }),
            invalidatesTags: ['User'],
            onQueryStarted: async (_, { queryFulfilled }) => {
                try { await queryFulfilled; } catch {}
                localStorage.removeItem('user_token');
                localStorage.removeItem('user');
            },
        }),

        // GET /auth/me
        getProfile: builder.query({
            query: () => ({ url: '/auth/me', method: 'GET' }),
            providesTags: ['User'],
            transformResponse: (response) => {
                if (response?.user) localStorage.setItem('user', JSON.stringify(response.user));
                return response;
            },
        }),

        // PUT /auth/change-password
        changePassword: builder.mutation({
            query: (data) => ({ url: '/auth/change-password', method: 'PUT', data }),
        }),

        // POST /auth/forgot-password
        forgotPassword: builder.mutation({
            query: (data) => ({ url: '/auth/forgot-password', method: 'POST', data }),
        }),

        // POST /auth/reset-password
        resetPassword: builder.mutation({
            query: (data) => ({ url: '/auth/reset-password', method: 'POST', data }),
        }),

        // POST /auth/verify-otp
        verifyOtp: builder.mutation({
            query: (data) => ({ url: '/auth/verify-otp', method: 'POST', data }),
        }),

        // POST /auth/resend-otp
        resendOtp: builder.mutation({
            query: (email) => ({ url: '/auth/resend-otp', method: 'POST', data: { email } }),
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useGetProfileQuery,
    useChangePasswordMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
} = authApi;
