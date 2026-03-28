import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const academicsApi = createApi({
    reducerPath: 'academicsApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Class', 'Subject', 'Timetable'],
    endpoints: (builder) => ({

        // ─── CLASSES ───────────────────────────────────────────────────────────

        // GET /academics/classes
        getAllClasses: builder.query({
            query: ({ search, level, group } = {}) => ({
                url: '/academics/classes',
                method: 'GET',
                params: { search, level, group },
            }),
            providesTags: ['Class'],
        }),

        // GET /academics/classes/:id
        getClass: builder.query({
            query: (id) => ({
                url: `/academics/classes/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Class', id }],
        }),

        // POST /academics/classes
        createClass: builder.mutation({
            query: (data) => ({
                url: '/academics/classes',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Class'],
        }),

        // PUT /academics/classes/:id
        updateClass: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/academics/classes/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Class', id }, 'Class'],
        }),

        // DELETE /academics/classes/:id
        deleteClass: builder.mutation({
            query: (id) => ({
                url: `/academics/classes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Class'],
        }),

        // ─── SUBJECTS ──────────────────────────────────────────────────────────

        // GET /academics/subjects
        getAllSubjects: builder.query({
            query: ({ search, category, dept } = {}) => ({
                url: '/academics/subjects',
                method: 'GET',
                params: { search, category, dept },
            }),
            providesTags: ['Subject'],
        }),

        // GET /academics/subjects/:id
        getSubject: builder.query({
            query: (id) => ({
                url: `/academics/subjects/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Subject', id }],
        }),

        // POST /academics/subjects
        createSubject: builder.mutation({
            query: (data) => ({
                url: '/academics/subjects',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Subject'],
        }),

        // PUT /academics/subjects/:id
        updateSubject: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/academics/subjects/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Subject', id }, 'Subject'],
        }),

        // DELETE /academics/subjects/:id
        deleteSubject: builder.mutation({
            query: (id) => ({
                url: `/academics/subjects/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Subject'],
        }),

        // ─── TIMETABLE ─────────────────────────────────────────────────────────

        // GET /academics/timetable/:className
        getTimetable: builder.query({
            query: ({ className, session, term } = {}) => ({
                url: `/academics/timetable/${encodeURIComponent(className)}`,
                method: 'GET',
                params: { session, term },
            }),
            providesTags: (result, error, { className }) => [{ type: 'Timetable', id: className }],
        }),

        // PUT /academics/timetable/:className/cell
        saveTimetableCell: builder.mutation({
            query: ({ className, ...data }) => ({
                url: `/academics/timetable/${encodeURIComponent(className)}/cell`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { className }) => [{ type: 'Timetable', id: className }],
        }),

        // DELETE /academics/timetable/:className/cell
        clearTimetableCell: builder.mutation({
            query: ({ className, ...data }) => ({
                url: `/academics/timetable/${encodeURIComponent(className)}/cell`,
                method: 'DELETE',
                data,
            }),
            invalidatesTags: (result, error, { className }) => [{ type: 'Timetable', id: className }],
        }),

        // DELETE /academics/timetable/:className
        clearFullTimetable: builder.mutation({
            query: ({ className, session, term }) => ({
                url: `/academics/timetable/${encodeURIComponent(className)}`,
                method: 'DELETE',
                params: { session, term },
            }),
            invalidatesTags: (result, error, { className }) => [{ type: 'Timetable', id: className }],
        }),
    }),
});

export const {
    useGetAllClassesQuery,
    useGetClassQuery,
    useCreateClassMutation,
    useUpdateClassMutation,
    useDeleteClassMutation,
    useGetAllSubjectsQuery,
    useGetSubjectQuery,
    useCreateSubjectMutation,
    useUpdateSubjectMutation,
    useDeleteSubjectMutation,
    useGetTimetableQuery,
    useSaveTimetableCellMutation,
    useClearTimetableCellMutation,
    useClearFullTimetableMutation,
} = academicsApi;
