import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['User'],
    endpoints: (builder) => ({

        // ─── PUBLIC ENDPOINTS ───────────────────────────────────────────────────

        // POST /auth/login
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                data: credentials,
            }),
            invalidatesTags: ['User'],
            // Store token in localStorage on successful login
            onQueryStarted: async (_, { queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.token) {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),

        // ─── PROTECTED ENDPOINTS ────────────────────────────────────────────────

        // POST /auth/logout
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User'],
            // Clear localStorage on logout
            onQueryStarted: async (_, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                } catch (error) {
                    // Even if API call fails, clear local storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    console.error('Logout failed:', error);
                }
            },
        }),

        // GET /auth/me
        getProfile: builder.query({
            query: () => ({
                url: '/auth/me',
                method: 'GET',
            }),
            providesTags: ['User'],
            // Try to get user from localStorage first for faster initial load
            transformResponse: (response) => {
                // Update localStorage with latest user data
                if (response?.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
                return response;
            },
        }),

        // PUT /auth/change-password
        changePassword: builder.mutation({
            query: (data) => ({
                url: '/auth/change-password',
                method: 'PUT',
                data,
            }),
            // Don't invalidate user tag for password change unless the user data changes
            // (e.g., if mustResetPassword flag is updated)
            invalidatesTags: (result, error) => {
                // If password change was successful and cleared the mustResetPassword flag,
                // invalidate the user to update the flag
                if (result?.user?.mustResetPassword === false) {
                    return ['User'];
                }
                return [];
            },
        }),
    }),
});

// ─── EXPORT HOOKS ─────────────────────────────────────────────────────────────

export const {
    useLoginMutation,
    useLogoutMutation,
    useGetProfileQuery,
    useChangePasswordMutation,
} = authApi;