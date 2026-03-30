import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const assignmentsApi = createApi({
    reducerPath: 'assignmentsApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Assignment'],
    endpoints: (builder) => ({

        // GET /assignments  — teacher sees their own; admin sees all
        getAllAssignments: builder.query({
            query: ({ page, limit, search, subject, class: cls, status, teacherId } = {}) => ({
                url: '/assignments',
                method: 'GET',
                params: { page, limit, search, subject, class: cls, status, teacherId },
            }),
            providesTags: ['Assignment'],
        }),

        // GET /assignments/:id
        getAssignment: builder.query({
            query: (id) => ({
                url: `/assignments/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Assignment', id }],
        }),

        // POST /assignments
        createAssignment: builder.mutation({
            query: (data) => ({
                url: '/assignments',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Assignment'],
        }),

        // PUT /assignments/:id
        updateAssignment: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/assignments/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Assignment', id }, 'Assignment'],
        }),

        // DELETE /assignments/:id
        deleteAssignment: builder.mutation({
            query: (id) => ({
                url: `/assignments/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Assignment'],
        }),

        // GET /assignments/parent  — returns assignments for parent's children
        getParentAssignments: builder.query({
            query: ({ childId, class: cls, subject, status } = {}) => ({
                url: '/assignments/parent',
                method: 'GET',
                params: { childId, class: cls, subject, status },
            }),
            providesTags: ['Assignment'],
        }),
    }),
});

export const {
    useGetAllAssignmentsQuery,
    useGetAssignmentQuery,
    useCreateAssignmentMutation,
    useUpdateAssignmentMutation,
    useDeleteAssignmentMutation,
    useGetParentAssignmentsQuery,
} = assignmentsApi;
