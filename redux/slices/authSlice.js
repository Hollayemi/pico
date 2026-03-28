import { createApi } from '@reduxjs/toolkit/query/react';
import { createSlice } from '@reduxjs/toolkit';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        // Login
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                data: credentials,
            }),
            invalidatesTags: ['User'],
        }),


        // Forgot Password
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                data: { email },
            }),
        }),

        // Reset Password
        resetPassword: builder.mutation({
            query: (resetData) => ({
                url: '/auth/change-password',
                method: 'PATCH',
                data: resetData,
            }),
        }),

        // Get User Profile
        getProfile: builder.query({
            query: () => ({
                url: '/auth/me',
                method: 'GET',
                authType: 'store',
            }),
            providesTags: ['User'],
        }),

        // Logout
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
                authType: 'store',
            }),
            invalidatesTags: ['User'],
        }),

        changePassword: builder.mutation({
            query: (data) => ({
                url: "/auth/change-password",
                method: "PATCH",
                data
            })
        }),
    }),
});

export const {
    useLoginMutation,
    useGetProfileQuery,
    useLogoutMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,

} = authApi;


const initialState = {
    user: null,
    token: typeof window !== "undefined" && localStorage.getItem('stoken'),
    isAuthenticated: typeof window !== "undefined" && !!localStorage.getItem('token'),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { token:accessToken, admin, ...user } = action.payload;
            state.user = user;
            state.token = accessToken;
            state.isAuthenticated = true;
            typeof window !== "undefined" && localStorage.setItem('token', accessToken);
        },
        logoutUser: (state, action) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            if (typeof window !== "undefined") {
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                window.location.replace("/portals/auth/admin/login")
            }
        },
        clearError: (state) => {
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setCredentials, logoutUser, clearError, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;