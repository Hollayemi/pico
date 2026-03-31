import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const resultsApi = createApi({
    reducerPath: 'resultsApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Result', 'ReportCard', 'ResultSummary'],
    endpoints: (builder) => ({

        // ─── GET RESULTS FOR A CLASS/SUBJECT/TERM ────────────────────────────
        // GET /results?class=JSS 3&subject=Mathematics&term=2nd&session=2025/2026
        // Returns list of student results for entry/editing
        getClassResults: builder.query({
            query: ({ class: cls, subject, term, session, studentId } = {}) => ({
                url: '/results',
                method: 'GET',
                params: { class: cls, subject, term, session, studentId },
            }),
            providesTags: ['Result'],
        }),

        // ─── SAVE / UPDATE A SINGLE STUDENT RESULT ───────────────────────────
        // POST /results
        // Body: { studentId, class, subject, term, session, test1, test2, exam, firstTermTotal? }
        saveResult: builder.mutation({
            query: (data) => ({
                url: '/results',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Result', 'ReportCard', 'ResultSummary'],
        }),

        // ─── UPDATE RESULT ────────────────────────────────────────────────────
        // PUT /results/:id
        updateResult: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/results/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: ['Result', 'ReportCard', 'ResultSummary'],
        }),

        // ─── BULK UPLOAD RESULTS (CSV) ────────────────────────────────────────
        // POST /results/bulk
        // Body: { class, subject, term, session, results: [{ studentId, test1, test2, exam }] }
        bulkUploadResults: builder.mutation({
            query: (data) => ({
                url: '/results/bulk',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Result', 'ReportCard', 'ResultSummary'],
        }),

        // ─── GET REPORT CARD DATA FOR A STUDENT ───────────────────────────────
        // GET /results/report-card/:studentId?term=2nd&session=2025/2026
        // Returns full cumulative report card data matching the school's format
        getReportCard: builder.query({
            query: ({ studentId, term, session }) => ({
                url: `/results/report-card/${studentId}`,
                method: 'GET',
                params: { term, session },
            }),
            providesTags: (result, error, { studentId }) => [{ type: 'ReportCard', id: studentId }],
        }),

        // ─── GET CLASS REPORT SUMMARY ─────────────────────────────────────────
        // GET /results/class-summary?class=JSS 3&term=2nd&session=2025/2026
        // Returns: positions, averages, pass/fail counts
        getClassSummary: builder.query({
            query: ({ class: cls, term, session } = {}) => ({
                url: '/results/class-summary',
                method: 'GET',
                params: { class: cls, term, session },
            }),
            providesTags: ['ResultSummary'],
        }),

        // ─── PUBLISH RESULTS ──────────────────────────────────────────────────
        // POST /results/publish
        // Body: { class, term, session } — makes results visible to parents
        publishResults: builder.mutation({
            query: (data) => ({
                url: '/results/publish',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Result', 'ResultSummary'],
        }),

        // ─── SAVE AFFECTIVE / PSYCHOMOTOR TRAITS ─────────────────────────────
        // PUT /results/traits/:studentId
        // Body: { term, session, affective: {...}, psychomotor: {...},
        //         classTeacherComment, principalComment }
        saveTraits: builder.mutation({
            query: ({ studentId, ...data }) => ({
                url: `/results/traits/${studentId}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (r, e, { studentId }) => [{ type: 'ReportCard', id: studentId }],
        }),

        // ─── PARENT: GET CHILD RESULTS ────────────────────────────────────────
        // GET /parent/results/:childId
        getChildResults: builder.query({
            query: ({ childId, term, session } = {}) => ({
                url: `/parent/results/${childId}`,
                method: 'GET',
                params: { term, session },
            }),
            providesTags: (r, e, { childId }) => [{ type: 'ReportCard', id: childId }],
        }),
    }),
});

export const {
    useGetClassResultsQuery,
    useSaveResultMutation,
    useUpdateResultMutation,
    useBulkUploadResultsMutation,
    useGetReportCardQuery,
    useGetClassSummaryQuery,
    usePublishResultsMutation,
    useSaveTraitsMutation,
    useGetChildResultsQuery,
} = resultsApi;
