import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const admissionApi = createApi({
    reducerPath: 'admissionApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Admission', 'Application'],
    endpoints: (builder) => ({
        // Submit admission application
        submitApplication: builder.mutation({
            query: (formData) => ({
                url: '/admissions',
                method: 'POST',
                data: formData,
                // headers: {
                //     'Content-Type': 'multipart/form-data',
                // },
            }),
            invalidatesTags: ['Application'],
        }),

        // Get application by reference number
        getApplication: builder.query({
            query: ({ ref, email }) => ({
                url: `/admissions/${ref}`,
                method: 'GET',
                params: { email },
            }),
            providesTags: (result, error, { ref }) =>
                result ? [{ type: 'Application', id: ref }] : [],
        }),

        // Get all applications (Admin)
        getAllApplications: builder.query({
            query: ({ status, page = 1, limit = 20, sortBy = '-submittedAt' } = {}) => ({
                url: '/admissions',
                method: 'GET',
                params: { status, page, limit, sortBy },
            }),
            providesTags: ['Application'],
        }),

        // Update application status (Admin)
        updateApplicationStatus: builder.mutation({
            query: ({ ref, status, adminNotes }) => ({
                url: `/admissions/${ref}/status`,
                method: 'PUT',
                data: { status, adminNotes },
            }),
            invalidatesTags: (result, error, { ref }) =>
                [{ type: 'Application', id: ref }, 'Application'],
        }),

        // Delete application (Admin)
        deleteApplication: builder.mutation({
            query: (ref) => ({
                url: `/admissions/${ref}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Application'],
        }),

        // Get application statistics (Admin)
        getStatistics: builder.query({
            query: () => ({
                url: '/admissions/stats/overview',
                method: 'GET',
            }),
            providesTags: ['Admission'],
        }),
    }),
});

export const {
    useSubmitApplicationMutation,
    useGetApplicationQuery,
    useGetAllApplicationsQuery,
    useUpdateApplicationStatusMutation,
    useDeleteApplicationMutation,
    useGetStatisticsQuery,
} = admissionApi;