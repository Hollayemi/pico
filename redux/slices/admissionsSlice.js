import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const admissionsApi = createApi({
    reducerPath: 'admissionsApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Application', 'Screening', 'Offer', 'Stats'],
    endpoints: (builder) => ({

        // ─── PUBLIC SUBMISSION ───────────────────────────────────────────────────

        // POST /admissions (public - no auth)
        submitApplication: builder.mutation({
            query: (data) => ({
                url: '/admissions',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Application', 'Stats'],
        }),

        // ─── STATISTICS ──────────────────────────────────────────────────────────

        // GET /admissions/stats
        getAdmissionsStats: builder.query({
            query: () => ({
                url: '/admissions/stats',
                method: 'GET',
            }),
            providesTags: ['Stats'],
        }),

        // ─── SCREENING ───────────────────────────────────────────────────────────

        // GET /admissions/screening
        getScreeningList: builder.query({
            query: ({ status, dateFrom, dateTo } = {}) => ({
                url: '/admissions/screening',
                method: 'GET',
                params: { status, dateFrom, dateTo },
            }),
            providesTags: ['Screening'],
        }),

        // PUT /admissions/:id/screening
        updateScreeningRecord: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/admissions/${id}/screening`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Application', id },
                { type: 'Screening' },
                'Stats'
            ],
        }),

        // ─── OFFERS ──────────────────────────────────────────────────────────────

        // GET /admissions/offers
        getOffersList: builder.query({
            query: ({ status, sentAfter, accepted } = {}) => ({
                url: '/admissions/offers',
                method: 'GET',
                params: { status, sentAfter, accepted },
            }),
            providesTags: ['Offer'],
        }),

        // POST /admissions/:id/offer
        sendOfferLetter: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/admissions/${id}/offer`,
                method: 'POST',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Application', id },
                { type: 'Offer' },
                'Stats'
            ],
        }),

        // PATCH /admissions/:id/offer/status
        updateOfferAcceptanceStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/admissions/${id}/offer/status`,
                method: 'PATCH',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Application', id },
                { type: 'Offer' },
                'Stats'
            ],
        }),

        // ─── APPLICATIONS ────────────────────────────────────────────────────────

        // GET /admissions
        getAllApplications: builder.query({
            query: ({ page, limit, status, sort, fromDate, toDate } = {}) => ({
                url: '/admissions',
                method: 'GET',
                params: { page, limit, status, sort, fromDate, toDate },
            }),
            providesTags: (result) => 
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Application', id })),
                        { type: 'Application', id: 'LIST' },
                      ]
                    : [{ type: 'Application', id: 'LIST' }],
        }),

        // GET /admissions/:id
        getApplication: builder.query({
            query: (id) => ({
                url: `/admissions/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Application', id }],
        }),

        // PATCH /admissions/:id/status
        updateApplicationStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/admissions/${id}/status`,
                method: 'PATCH',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Application', id },
                { type: 'Application', id: 'LIST' },
                { type: 'Screening' },
                { type: 'Offer' },
                'Stats'
            ],
        }),

        // DELETE /admissions/:id
        deleteApplication: builder.mutation({
            query: (id) => ({
                url: `/admissions/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Application', id },
                { type: 'Application', id: 'LIST' },
                { type: 'Screening' },
                { type: 'Offer' },
                'Stats'
            ],
        }),
    }),
});

// ─── EXPORT HOOKS ─────────────────────────────────────────────────────────────

export const {
    // Public
    useSubmitApplicationMutation,
    
    // Stats
    useGetAdmissionsStatsQuery,
    
    // Screening
    useGetScreeningListQuery,
    useUpdateScreeningRecordMutation,
    
    // Offers
    useGetOffersListQuery,
    useSendOfferLetterMutation,
    useUpdateOfferAcceptanceStatusMutation,
    
    // Applications
    useGetAllApplicationsQuery,
    useGetApplicationQuery,
    useUpdateApplicationStatusMutation,
    useDeleteApplicationMutation,
} = admissionsApi;