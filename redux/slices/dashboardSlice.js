import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['DashboardSummary'],
    endpoints: (builder) => ({

        // GET /dashboard/summary
        getDashboardSummary: builder.query({
            query: ({ session, term } = {}) => ({
                url: '/dashboard/summary',
                method: 'GET',
                params: {
                    ...(session && { session }),
                    ...(term && { term }),
                },
            }),
            providesTags: ['DashboardSummary'],

            // Typed transform so consumers get a flat, predictable shape
            transformResponse: (response) => response?.data ?? null,
        }),
    }),
});

export const { useGetDashboardSummaryQuery } = dashboardApi;
