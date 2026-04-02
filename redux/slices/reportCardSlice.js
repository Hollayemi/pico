/**
 * redux/slices/reportCardSlice.js
 *
 * RTK Query API slice for admin Report Card and Results endpoints.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const reportCardApi = createApi({
  reducerPath: 'reportCardApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['SubjectScores', 'ReportCard', 'ClassReportCards'],
  endpoints: (builder) => ({

    // ── Score entry ─────────────────────────────────────────────────────────

    /** GET /report/results?class=&subject=&term=&session= */
    getClassSubjectScores: builder.query({
      query: ({ class: cls, subject, term, session }) => ({
        url: '/report/results',
        params: { class: cls, subject, term, session },
      }),
      providesTags: (_r, _e, { class: cls, subject, term, session }) => [
        { type: 'SubjectScores', id: `${cls}-${subject}-${term}-${session}` },
      ],
    }),

    /** POST /report/results/bulk  — JSON payload */
    bulkSaveScores: builder.mutation({
      query: (data) => ({ 
        url: '/report/results/bulk', 
        method: 'POST', 
        data:data 
      }),
      invalidatesTags: (_r, _e, { class: cls, subject, term, session }) => [
        { type: 'SubjectScores', id: `${cls}-${subject}-${term}-${session}` },
        { type: 'ClassReportCards', id: `${cls}-${term}-${session}` },
      ],
    }),

    /**
     * POST /report/results/csv-upload  — multipart/form-data
     * Pass a FormData object as the data; RTK Query will leave Content-Type unset
     * so the browser sets it automatically with the correct boundary.
     */
    uploadCsvScores: builder.mutation({
      query: (formData) => ({
        url: '/report/results/csv-upload',
        method: 'POST',
        data: formData,
        // Do NOT set Content-Type — browser must set it with the multipart boundary
        isFormData: true,
      }),
      invalidatesTags: (result) => {
        if (!result?.data) return ['SubjectScores'];
        const { class: cls, subject, term, session } = result.data;
        return [
          { type: 'SubjectScores',    id: `${cls}-${subject}-${term}-${session}` },
          { type: 'ClassReportCards', id: `${cls}-${term}-${session}` },
        ];
      },
    }),

    /** GET /report/results/summary?class=&term=&session= */
    getClassSummary: builder.query({
      query: ({ class: cls, term, session }) => ({
        url: '/report/results/summary',
        params: { class: cls, term, session },
      }),
    }),

    /** GET /report/results/subjects?class= */
    getSubjectsForClass: builder.query({
      query: (cls) => ({ url: '/report/results/subjects', params: { class: cls } }),
    }),

    // ── Report Cards (admin) ────────────────────────────────────────────────

    /** POST /report/report-cards/generate */
    generateReportCards: builder.mutation({
      query: (data) => ({ url: '/report/report-cards/generate', method: 'POST', data }),
      invalidatesTags: (_r, _e, { class: cls, term, session }) => [
        { type: 'ClassReportCards', id: `${cls}-${term}-${session}` },
      ],
    }),

    /** GET /report/report-cards?class=&term=&session= */
    getClassReportCards: builder.query({
      query: ({ class: cls, term, session }) => ({
        url: '/report/report-cards',
        params: { class: cls, term, session },
      }),
      providesTags: (_r, _e, { class: cls, term, session }) => [
        { type: 'ClassReportCards', id: `${cls}-${term}-${session}` },
      ],
    }),

    /** GET /report/report-cards/student/:studentId?term=&session= */
    getReportCard: builder.query({
      query: ({ studentId, term, session }) => ({
        url: `/report/report-cards/student/${studentId}`,
        params: { term, session },
      }),
      providesTags: (_r, _e, { studentId, term, session }) => [
        { type: 'ReportCard', id: `${studentId}-${term}-${session}` },
      ],
    }),

    /** PUT /report/report-cards/student/:studentId/traits?term=&session= */
    updateTraits: builder.mutation({
      query: ({ studentId, term, session, ...data }) => ({
        url: `/report/report-cards/student/${studentId}/traits`,
        method: 'PUT',
        params: { term, session },
        data,
      }),
      invalidatesTags: (_r, _e, { studentId, term, session }) => [
        { type: 'ReportCard', id: `${studentId}-${term}-${session}` },
      ],
    }),

    /** POST /report/report-cards/publish */
    publishReportCards: builder.mutation({
      query: (data) => ({ url: '/report/report-cards/publish', method: 'POST', data }),
      invalidatesTags: (_r, _e, { class: cls, term, session }) => [
        { type: 'ClassReportCards', id: `${cls}-${term}-${session}` },
      ],
    }),
  }),
});

export const {
  useGetClassSubjectScoresQuery,
  useBulkSaveScoresMutation,
  useUploadCsvScoresMutation,
  useGetClassSummaryQuery,
  useGetSubjectsForClassQuery,
  useGenerateReportCardsMutation,
  useGetClassReportCardsQuery,
  useGetReportCardQuery,
  useUpdateTraitsMutation,
  usePublishReportCardsMutation,
} = reportCardApi;
