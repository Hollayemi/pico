import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['DashboardSummary'],
    endpoints: (builder) => ({

        // ─── DASHBOARD SUMMARY ───────────────────────────────────────────────────

        // GET /dashboard/summary
        getDashboardSummary: builder.query({
            query: ({ period = 'current', year, month, week } = {}) => ({
                url: '/dashboard/summary',
                method: 'GET',
                params: { period, year, month, week },
            }),
            providesTags: ['DashboardSummary'],
            transformResponse: (response) => {
                // The API already returns role-based filtered data
                // (accountant gets finance-only, admin/principal get full)
                return response;
            },
        }),
    }),
});

// ─── EXPORT HOOKS ─────────────────────────────────────────────────────────────

export const {
    useGetDashboardSummaryQuery,
} = dashboardApi;