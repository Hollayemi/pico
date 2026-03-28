import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const settingsApi = createApi({
    reducerPath: 'settingsApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['SchoolInfo', 'AcademicSettings', 'Notifications', 'Security'],
    endpoints: (builder) => ({

        // ─── SCHOOL INFO ───────────────────────────────────────────────────────

        // GET /settings/school
        getSchoolInfo: builder.query({
            query: () => ({
                url: '/settings/school',
                method: 'GET',
            }),
            providesTags: ['SchoolInfo'],
        }),

        // PUT /settings/school
        updateSchoolInfo: builder.mutation({
            query: (data) => ({
                url: '/settings/school',
                method: 'PUT',
                data,
            }),
            invalidatesTags: ['SchoolInfo'],
        }),

        // ─── ACADEMIC SETTINGS ─────────────────────────────────────────────────

        // GET /settings/academic
        getAcademicSettings: builder.query({
            query: () => ({
                url: '/settings/academic',
                method: 'GET',
            }),
            providesTags: ['AcademicSettings'],
        }),

        // PATCH /settings/academic/session
        updateAcademicSession: builder.mutation({
            query: (data) => ({
                url: '/settings/academic/session',
                method: 'PATCH',
                data,
            }),
            invalidatesTags: ['AcademicSettings'],
        }),

        // POST /settings/academic/terms
        createTerm: builder.mutation({
            query: (data) => ({
                url: '/settings/academic/terms',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['AcademicSettings'],
        }),

        // PUT /settings/academic/terms/:id
        updateTerm: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/settings/academic/terms/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: ['AcademicSettings'],
        }),

        // DELETE /settings/academic/terms/:id
        deleteTerm: builder.mutation({
            query: (id) => ({
                url: `/settings/academic/terms/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AcademicSettings'],
        }),

        // PATCH /settings/academic/terms/:id/set-current
        setCurrentTerm: builder.mutation({
            query: (id) => ({
                url: `/settings/academic/terms/${id}/set-current`,
                method: 'PATCH',
            }),
            invalidatesTags: ['AcademicSettings'],
        }),

        // ─── NOTIFICATIONS ─────────────────────────────────────────────────────

        // GET /settings/notifications
        getNotificationSettings: builder.query({
            query: () => ({
                url: '/settings/notifications',
                method: 'GET',
            }),
            providesTags: ['Notifications'],
        }),

        // PUT /settings/notifications
        updateNotificationSettings: builder.mutation({
            query: (data) => ({
                url: '/settings/notifications',
                method: 'PUT',
                data,
            }),
            invalidatesTags: ['Notifications'],
        }),

        // ─── SECURITY ──────────────────────────────────────────────────────────

        // GET /settings/security
        getSecuritySettings: builder.query({
            query: () => ({
                url: '/settings/security',
                method: 'GET',
            }),
            providesTags: ['Security'],
        }),

        // PUT /settings/security
        updateSecuritySettings: builder.mutation({
            query: (data) => ({
                url: '/settings/security',
                method: 'PUT',
                data,
            }),
            invalidatesTags: ['Security'],
        }),

        // POST /settings/security/force-password-reset
        forcePasswordReset: builder.mutation({
            query: () => ({
                url: '/settings/security/force-password-reset',
                method: 'POST',
            }),
            invalidatesTags: ['Security'],
        }),

        // POST /settings/security/clear-sessions
        clearAllSessions: builder.mutation({
            query: () => ({
                url: '/settings/security/clear-sessions',
                method: 'POST',
            }),
            invalidatesTags: ['Security'],
        }),
    }),
});

export const {
    useGetSchoolInfoQuery,
    useUpdateSchoolInfoMutation,
    useGetAcademicSettingsQuery,
    useUpdateAcademicSessionMutation,
    useCreateTermMutation,
    useUpdateTermMutation,
    useDeleteTermMutation,
    useSetCurrentTermMutation,
    useGetNotificationSettingsQuery,
    useUpdateNotificationSettingsMutation,
    useGetSecuritySettingsQuery,
    useUpdateSecuritySettingsMutation,
    useForcePasswordResetMutation,
    useClearAllSessionsMutation,
} = settingsApi;
