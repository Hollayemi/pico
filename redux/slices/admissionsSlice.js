import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const admissionsApi = createApi({
    reducerPath: 'admissionsApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Application', 'Screening', 'Offer', 'Stats'],
    endpoints: (builder) => ({

        // ─── APPLICATIONS ────────────────────────────────────────────────────

        // GET /admissions
        getAllApplications: builder.query({
            query: ({ page, limit, search, status, appliedClass, schoolingOption, dateFrom } = {}) => ({
                url: '/admissions',
                method: 'GET',
                params: { page, limit, search, status, appliedClass, schoolingOption, dateFrom },
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...( result.data.applications || []).map(({ id }) => ({ type: 'Application', id })),
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

        // POST /admissions (public — used by the apply form)
        submitApplication: builder.mutation({
            query: (data) => ({
                url: '/admissions',
                method: 'POST',
                data,
            }),
            invalidatesTags: [{ type: 'Application', id: 'LIST' }, 'Stats'],
        }),

        // PATCH /admissions/:id/status
        updateApplicationStatus: builder.mutation({
            query: ({ id, status, reviewedBy, adminNotes }) => ({
                url: `/admissions/${id}/status`,
                method: 'PATCH',
                data: { status, reviewedBy, adminNotes },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Application', id },
                { type: 'Application', id: 'LIST' },
                'Screening',
                'Offer',
                'Stats',
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
                'Stats',
            ],
        }),

        // ─── SCREENING ───────────────────────────────────────────────────────

        // GET /admissions/screening
        getScreeningList: builder.query({
            query: ({ page, limit, search, screeningStatus } = {}) => ({
                url: '/admissions/screening',
                method: 'GET',
                params: { page, limit, search, screeningStatus },
            }),
            providesTags: ['Screening'],
        }),

        // PUT /admissions/:id/screening
        updateScreeningRecord: builder.mutation({
            query: ({ id, docs, screeningStatus, assignedOfficer, notes }) => ({
                url: `/admissions/${id}/screening`,
                method: 'PUT',
                data: { docs, screeningStatus, assignedOfficer, notes },
            }),
            invalidatesTags: ['Screening', 'Stats'],
        }),

        // ─── OFFERS ──────────────────────────────────────────────────────────

        // GET /admissions/offers
        getOffersList: builder.query({
            query: ({ page, limit, search, acceptanceStatus } = {}) => ({
                url: '/admissions/offers',
                method: 'GET',
                params: { page, limit, search, acceptanceStatus },
            }),
            providesTags: ['Offer'],
        }),

        // POST /admissions/:id/offer
        sendOfferLetter: builder.mutation({
            query: ({ id, acceptanceDeadline, resend = false }) => ({
                url: `/admissions/${id}/offer`,
                method: 'POST',
                data: { acceptanceDeadline, resend },
            }),
            invalidatesTags: ['Offer', 'Stats'],
        }),

        // PATCH /admissions/:id/offer/status
        updateOfferAcceptanceStatus: builder.mutation({
            query: ({ id, acceptanceStatus }) => ({
                url: `/admissions/${id}/offer/status`,
                method: 'PATCH',
                data: { acceptanceStatus },
            }),
            invalidatesTags: ['Offer', 'Stats'],
        }),

        // ─── STATS ───────────────────────────────────────────────────────────

        // GET /admissions/stats
        getAdmissionsStats: builder.query({
            query: () => ({
                url: '/admissions/stats',
                method: 'GET',
            }),
            providesTags: ['Stats'],
        }),
    }),
});

export const {
    // Applications
    useGetAllApplicationsQuery,
    useGetApplicationQuery,
    useSubmitApplicationMutation,
    useUpdateApplicationStatusMutation,
    useDeleteApplicationMutation,
    // Screening
    useGetScreeningListQuery,
    useUpdateScreeningRecordMutation,
    // Offers
    useGetOffersListQuery,
    useSendOfferLetterMutation,
    useUpdateOfferAcceptanceStatusMutation,
    // Stats
    useGetAdmissionsStatsQuery,
} = admissionsApi;
