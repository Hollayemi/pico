import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const financeApi = createApi({
    reducerPath: 'financeApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['FeeRecord', 'Payment', 'Invoice'],
    endpoints: (builder) => ({

        // ─── SUMMARY ───────────────────────────────────────────────────────────

        // GET /finance/summary
        getFinanceSummary: builder.query({
            query: ({ term } = {}) => ({
                url: '/finance/summary',
                method: 'GET',
                params: { term },
            }),
            providesTags: ['FeeRecord', 'Payment'],
        }),

        // ─── FEE RECORDS ───────────────────────────────────────────────────────

        // GET /finance/fees
        getAllFeeRecords: builder.query({
            query: ({ page, limit, search, class: cls, status, schoolingOption, paidPercentLessThan, term } = {}) => ({
                url: '/finance/fees',
                method: 'GET',
                params: { page, limit, search, class: cls, status, schoolingOption, paidPercentLessThan, term },
            }),
            providesTags: ['FeeRecord'],
        }),

        // GET /finance/fees/:studentId
        getStudentFeeRecord: builder.query({
            query: ({ studentId, term } = {}) => ({
                url: `/finance/fees/${studentId}`,
                method: 'GET',
                params: { term },
            }),
            providesTags: (result, error, { studentId }) => [{ type: 'FeeRecord', id: studentId }],
        }),

        // ─── PAYMENTS ──────────────────────────────────────────────────────────

        // POST /finance/payments
        recordPayment: builder.mutation({
            query: (data) => ({
                url: '/finance/payments',
                method: 'POST',
                data,
            }),
            invalidatesTags: (result, error, { studentId }) => [
                { type: 'FeeRecord', id: studentId },
                'FeeRecord',
                'Payment',
                'Invoice',
            ],
        }),

        // GET /finance/payments
        getAllPayments: builder.query({
            query: ({ page, limit, search, method, dateFrom, dateTo, term } = {}) => ({
                url: '/finance/payments',
                method: 'GET',
                params: { page, limit, search, method, dateFrom, dateTo, term },
            }),
            providesTags: ['Payment'],
        }),

        // ─── INVOICES ──────────────────────────────────────────────────────────

        // GET /finance/invoices
        getAllInvoices: builder.query({
            query: ({ page, limit, search, status, term } = {}) => ({
                url: '/finance/invoices',
                method: 'GET',
                params: { page, limit, search, status, term },
            }),
            providesTags: ['Invoice'],
        }),

        // GET /finance/invoices/:invoiceId
        getInvoice: builder.query({
            query: (invoiceId) => ({
                url: `/finance/invoices/${invoiceId}`,
                method: 'GET',
            }),
            providesTags: (result, error, invoiceId) => [{ type: 'Invoice', id: invoiceId }],
        }),

        // POST /finance/invoices/generate
        generateInvoices: builder.mutation({
            query: (data) => ({
                url: '/finance/invoices/generate',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Invoice', 'FeeRecord'],
        }),

        // POST /finance/invoices/:invoiceId/send
        sendInvoiceToParent: builder.mutation({
            query: (invoiceId) => ({
                url: `/finance/invoices/${invoiceId}/send`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, invoiceId) => [{ type: 'Invoice', id: invoiceId }, 'Invoice'],
        }),
    }),
});

export const {
    useGetFinanceSummaryQuery,
    useGetAllFeeRecordsQuery,
    useGetStudentFeeRecordQuery,
    useRecordPaymentMutation,
    useGetAllPaymentsQuery,
    useGetAllInvoicesQuery,
    useGetInvoiceQuery,
    useGenerateInvoicesMutation,
    useSendInvoiceToParentMutation,
} = financeApi;
