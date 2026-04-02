/**
 * redux/slices/parent/parentReportCardSlice.js
 *
 * RTK Query API slice for parent-facing report card endpoints.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const parentReportCardApi = createApi({
  reducerPath: 'parentReportCardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1`,
    prepareHeaders: (headers) => {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['ParentReportCard'],
  endpoints: (builder) => ({

    /** GET /parent/report-cards/:studentId?term=&session= */
    getMyReportCard: builder.query({
      query: ({ studentId, term, session }) => ({
        url: `/parent/report-cards/${studentId}`,
        params: { term, session },
      }),
      providesTags: (_r, _e, { studentId, term, session }) => [
        { type: 'ParentReportCard', id: `${studentId}-${term}-${session}` },
      ],
    }),

    /** GET /parent/report-cards/:studentId/all */
    getMyReportCards: builder.query({
      query: (studentId) => `/parent/report-cards/${studentId}/all`,
      providesTags: (_r, _e, studentId) => [
        { type: 'ParentReportCard', id: studentId },
      ],
    }),
  }),
});

export const {
  useGetMyReportCardQuery,
  useGetMyReportCardsQuery,
} = parentReportCardApi;
