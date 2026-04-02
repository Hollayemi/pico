import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const settingsApi = createApi({
    reducerPath: 'settingsApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['SchoolInfo', 'AcademicSettings', 'Notifications', 'Security', 'FeeStructure'],
    endpoints: (builder) => ({

        // ─── SCHOOL INFO ───────────────────────────────────────────────────────

        getSchoolInfo: builder.query({
            query: () => ({ url: '/settings/school', method: 'GET' }),
            providesTags: ['SchoolInfo'],
        }),

        updateSchoolInfo: builder.mutation({
            query: (data) => ({ url: '/settings/school', method: 'PUT', data }),
            invalidatesTags: ['SchoolInfo'],
        }),

        // ─── ACADEMIC SETTINGS ─────────────────────────────────────────────────

        getAcademicSettings: builder.query({
            query: () => ({ url: '/settings/academic', method: 'GET' }),
            providesTags: ['AcademicSettings'],
        }),

        updateAcademicSession: builder.mutation({
            query: (data) => ({ url: '/settings/academic/session', method: 'PATCH', data }),
            invalidatesTags: ['AcademicSettings'],
        }),

        createSession: builder.mutation({
            query: (data) => ({ url: '/settings/academic/session', method: 'POST', data }),
            invalidatesTags: ['AcademicSettings'],
        }),
    
        
        deleteSession: builder.mutation({
            query: (id) => ({ url: `/settings/academic/session/${id}`, method: 'DELETE' }),
            invalidatesTags: ['AcademicSettings'],
        }),

        setCurrentSession: builder.mutation({
            query: (id) => ({
                url: `/settings/academic/sessions/${id}/set-current`,
                method: 'PATCH',
            }),
            invalidatesTags: ['AcademicSettings'],
        }),

        createTerm: builder.mutation({
            query: (data) => ({ url: `/settings/academic/sessions/${data.sessionId}/terms`, method: 'POST', data }),
            invalidatesTags: ['AcademicSettings'],
        }),

        updateTerm: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/settings/academic/terms/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: ['AcademicSettings'],
        }),

        deleteTerm: builder.mutation({
            query: (id) => ({ url: `/settings/academic/terms/${id}`, method: 'DELETE' }),
            invalidatesTags: ['AcademicSettings'],
        }),

        setCurrentTerm: builder.mutation({
            query: (id) => ({
                url: `/settings/academic/terms/${id}/set-current`,
                method: 'PATCH',
            }),
            invalidatesTags: ['AcademicSettings'],
        }),

        // ─── NOTIFICATIONS ─────────────────────────────────────────────────────

        getNotificationSettings: builder.query({
            query: () => ({ url: '/settings/notifications', method: 'GET' }),
            providesTags: ['Notifications'],
        }),

        updateNotificationSettings: builder.mutation({
            query: (data) => ({ url: '/settings/notifications', method: 'PUT', data }),
            invalidatesTags: ['Notifications'],
        }),

        // ─── SECURITY ──────────────────────────────────────────────────────────

        getSecuritySettings: builder.query({
            query: () => ({ url: '/settings/security', method: 'GET' }),
            providesTags: ['Security'],
        }),

        updateSecuritySettings: builder.mutation({
            query: (data) => ({ url: '/settings/security', method: 'PUT', data }),
            invalidatesTags: ['Security'],
        }),

        forcePasswordReset: builder.mutation({
            query: () => ({
                url: '/settings/security/force-password-reset',
                method: 'POST',
            }),
            invalidatesTags: ['Security'],
        }),

        clearAllSessions: builder.mutation({
            query: () => ({
                url: '/settings/security/clear-sessions',
                method: 'POST',
            }),
            invalidatesTags: ['Security'],
        }),

        // ─── FEE STRUCTURE ─────────────────────────────────────────────────────

        /**
         * GET /settings/fees
         * Returns the full fee structure for all 6 student categories.
         * Each category has firstTerm / secondTerm / thirdTerm with an items array.
         */
        getFeeStructure: builder.query({
            query: () => ({ url: '/settings/fees', method: 'GET' }),
            providesTags: ['FeeStructure'],
        }),

        /**
         * PUT /settings/fees
         * Updates a single fee category.
         * Body: { category, label?, firstTerm?, secondTerm?, thirdTerm? }
         * OR full replacement: { feeStructure: { ... } }
         */
        updateFeeStructure: builder.mutation({
            query: (data) => ({ url: '/settings/fees', method: 'PUT', data }),
            invalidatesTags: ['FeeStructure'],
        }),
    }),
});

export const {
    useGetSchoolInfoQuery,
    useUpdateSchoolInfoMutation,
    useGetAcademicSettingsQuery,
    useUpdateAcademicSessionMutation,
    useCreateSessionMutation,
    useDeleteSessionMutation,
    useSetCurrentSessionMutation,
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
    useGetFeeStructureQuery,
    useUpdateFeeStructureMutation,
} = settingsApi;
