import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../api/axiosBaseQuery';

export const parentApi = createApi({
    reducerPath: 'parentApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['ParentChildren', 'ChildProfile', 'ChildFees', 'ParentFees', 'ParentInvoices', 'ParentProfile'],
    endpoints: (builder) => ({

        // ── Profile update ─────────────────────────────────────────────────────
        // PATCH /parent/profile  — update father/mother contact details
        updateParentProfile: builder.mutation({
            query: (data) => ({
                url: '/parent/profile',
                method: 'PATCH',
                data,
            }),
            invalidatesTags: ['ParentProfile'],
        }),

        // ── Children ──────────────────────────────────────────────────────────

        // GET /parent/children
        getMyChildren: builder.query({
            query: () => ({
                url: '/parent/children',
                method: 'GET',
            }),
            providesTags: ['ParentChildren'],
            transformResponse: (response) => response,
        }),

        // GET /parent/children/:id
        getChildProfile: builder.query({
            query: ({ studentId, term, session, detailed }) => ({
                url: `/parent/children/${studentId}`,
                method: 'GET',
                params: {
                    ...(term    && { term }),
                    ...(session && { session }),
                    ...(detailed !== undefined && { detailed }),
                },
            }),
            providesTags: (result, error, { studentId }) => [
                { type: 'ChildProfile', id: studentId },
            ],
            transformResponse: (response) => response,
        }),

        // ── Finance ───────────────────────────────────────────────────────────

        // GET /parent/children/:id/fees
        getChildFeeRecord: builder.query({
            query: ({ studentId, term, session }) => ({
                url: `/parent/children/${studentId}/fees`,
                method: 'GET',
                params: {
                    ...(term    && { term }),
                    ...(session && { session }),
                },
            }),
            providesTags: (result, error, { studentId }) => [
                { type: 'ChildFees', id: studentId },
            ],
        }),

        // GET /parent/fees
        getAllChildrenFees: builder.query({
            query: ({ term } = {}) => ({
                url: '/parent/fees',
                method: 'GET',
                params: { ...(term && { term }) },
            }),
            providesTags: ['ParentFees'],
        }),

        // GET /parent/invoices
        listInvoices: builder.query({
            query: ({ status, term, page, limit } = {}) => ({
                url: '/parent/invoices',
                method: 'GET',
                params: { status, term, page, limit },
            }),
            providesTags: ['ParentInvoices'],
        }),

        // GET /parent/invoices/:invoiceId
        getInvoice: builder.query({
            query: (invoiceId) => ({
                url: `/parent/invoices/${invoiceId}`,
                method: 'GET',
            }),
            providesTags: (result, error, invoiceId) => [
                { type: 'ParentInvoices', id: invoiceId },
            ],
        }),

        // ── Payments ──────────────────────────────────────────────────────────

        // POST /parent/payments/initiate
        initiatePayment: builder.mutation({
            query: (data) => ({
                url: '/parent/payments/initiate',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['ChildFees', 'ParentFees', 'ParentInvoices'],
        }),

        // GET /parent/payments/verify/:reference
        verifyPayment: builder.query({
            query: (reference) => ({
                url: `/parent/payments/verify/${reference}`,
                method: 'GET',
            }),
        }),

        // ── Report Cards ──────────────────────────────────────────────────────

        // GET /parent/report-cards/:studentId
        getMyReportCard: builder.query({
            query: ({ studentId, term, session }) => ({
                url: `/parent/report-cards/${studentId}`,
                method: 'GET',
                params: {
                    ...(term    && { term }),
                    ...(session && { session }),
                },
            }),
            providesTags: (result, error, { studentId }) => [
                { type: 'ChildProfile', id: `reportcard-${studentId}` },
            ],
        }),

        // GET /parent/report-cards/:studentId/all
        getMyReportCards: builder.query({
            query: (studentId) => ({
                url: `/parent/report-cards/${studentId}/all`,
                method: 'GET',
            }),
            providesTags: (result, error, studentId) => [
                { type: 'ChildProfile', id: `reportcards-${studentId}` },
            ],
        }),

        // ── Admissions ────────────────────────────────────────────────────────

        getMyApplications: builder.query({
            query: () => ({
                url: '/parent/admissions',
                method: 'GET',
            }),
        }),

        getMyApplication: builder.query({
            query: (id) => ({
                url: `/parent/admissions/${id}`,
                method: 'GET',
            }),
        }),

        submitApplication: builder.mutation({
            query: (data) => ({
                url: '/parent/admissions',
                method: 'POST',
                data,
            }),
        }),

        respondToOffer: builder.mutation({
            query: ({ id, acceptanceStatus }) => ({
                url: `/parent/admissions/${id}/offer`,
                method: 'PATCH',
                data: { acceptanceStatus },
            }),
        }),
    }),
});

export const {
    // Profile
    useUpdateParentProfileMutation,
    // Children
    useGetMyChildrenQuery,
    useGetChildProfileQuery,
    // Finance
    useGetChildFeeRecordQuery,
    useGetAllChildrenFeesQuery,
    useListInvoicesQuery,
    useGetInvoiceQuery,
    // Payments
    useInitiatePaymentMutation,
    useVerifyPaymentQuery,
    // Report Cards
    useGetMyReportCardQuery,
    useGetMyReportCardsQuery,
    // Admissions
    useGetMyApplicationsQuery,
    useGetMyApplicationQuery,
    useSubmitApplicationMutation,
    useRespondToOfferMutation,
} = parentApi;
