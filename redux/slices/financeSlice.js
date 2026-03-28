import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const financeApi = createApi({
    reducerPath: 'financeApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['FeeRecord', 'Payment', 'Invoice', 'FinanceSummary'],
    endpoints: (builder) => ({

        // ─── 2.1 FINANCE DASHBOARD SUMMARY ────────────────────────────────────
        // GET /finance/summary
        // Returns: { data: { term, totalExpected, totalCollected, totalOutstanding,
        //   collectionRate, studentCounts, atRiskCount, paymentMethodBreakdown,
        //   classSummary, recentPayments } }
        getFinanceSummary: builder.query({
            query: ({ term } = {}) => ({
                url: '/finance/summary',
                method: 'GET',
                params: { term },
            }),
            providesTags: ['FinanceSummary', 'FeeRecord', 'Payment'],
        }),

        // ─── 2.2 GET ALL FEE RECORDS ───────────────────────────────────────────
        // GET /finance/fees
        // Returns: { data: { students: [...], summary: {...}, pagination: {...} } }
        getAllFeeRecords: builder.query({
            query: ({ page, limit, search, class: cls, status, schoolingOption, paidPercentLessThan, term } = {}) => ({
                url: '/finance/fees',
                method: 'GET',
                params: { page, limit, search, class: cls, status, schoolingOption, paidPercentLessThan, term },
            }),
            providesTags: ['FeeRecord'],
        }),

        // ─── 2.3 GET SINGLE STUDENT FEE RECORD ────────────────────────────────
        // GET /finance/fees/:studentId
        // Returns: { data: { student: {...}, feeRecord: { term, totalFee, totalPaid,
        //   balance, paidPercent, status, payments: [...] } } }
        getStudentFeeRecord: builder.query({
            query: ({ studentId, term } = {}) => ({
                url: `/finance/fees/${studentId}`,
                method: 'GET',
                params: { term },
            }),
            providesTags: (result, error, { studentId }) => [{ type: 'FeeRecord', id: studentId }],
        }),

        // ─── 2.4 RECORD PAYMENT ────────────────────────────────────────────────
        // POST /finance/payments
        // Body: { studentId, amount, method, reference, date, term, receivedBy }
        // Returns: { data: { payment: {...}, updatedFeeRecord: {...} } }
        recordPayment: builder.mutation({
            query: (data) => ({
                url: '/finance/payments',
                method: 'POST',
                data,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'FeeRecord', id: arg.studentId },
                'FeeRecord',
                'Payment',
                'Invoice',
                'FinanceSummary',
            ],
        }),

        // ─── 2.5 GET ALL PAYMENTS ──────────────────────────────────────────────
        // GET /finance/payments
        // Returns: { data: { payments: [...], totals: { count, totalAmount }, pagination } }
        getAllPayments: builder.query({
            query: ({ page, limit, search, method, dateFrom, dateTo, term } = {}) => ({
                url: '/finance/payments',
                method: 'GET',
                params: { page, limit, search, method, dateFrom, dateTo, term },
            }),
            providesTags: ['Payment'],
        }),

        // ─── 2.6 GET ALL INVOICES ──────────────────────────────────────────────
        // GET /finance/invoices
        // Returns: { data: { invoices: [...], stats: {...}, pagination } }
        getAllInvoices: builder.query({
            query: ({ page, limit, search, status, term } = {}) => ({
                url: '/finance/invoices',
                method: 'GET',
                params: { page, limit, search, status, term },
            }),
            providesTags: ['Invoice'],
        }),

        // ─── 2.7 GET SINGLE INVOICE ────────────────────────────────────────────
        // GET /finance/invoices/:invoiceId
        // Returns: { data: { invoice: { ..., lineItems, payments } } }
        getInvoice: builder.query({
            query: (invoiceId) => ({
                url: `/finance/invoices/${invoiceId}`,
                method: 'GET',
            }),
            providesTags: (result, error, invoiceId) => [{ type: 'Invoice', id: invoiceId }],
        }),

        // ─── 2.8 GENERATE INVOICES (BULK) ─────────────────────────────────────
        // POST /finance/invoices/generate
        // Body: { term?, classes? }
        generateInvoices: builder.mutation({
            query: (data) => ({
                url: '/finance/invoices/generate',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Invoice', 'FeeRecord', 'FinanceSummary'],
        }),

        // ─── 2.9 SEND INVOICE TO PARENT ───────────────────────────────────────
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
