import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const studentApi = createApi({
    reducerPath: 'studentApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Student'],
    endpoints: (builder) => ({

        // GET /students
        getAllStudents: builder.query({
            query: ({ page, limit, search, class: cls, status, schoolingOption, gender } = {}) => ({
                url: '/students',
                method: 'GET',
                params: { page, limit, search, class: cls, status, schoolingOption, gender },
            }),
            providesTags: ['Student'],
        }),

        // GET /students/:id
        getStudent: builder.query({
            query: (id) => ({
                url: `/students/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Student', id }],
        }),

        // POST /students
        addStudent: builder.mutation({
            query: (data) => ({
                url: '/students',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Student'],
        }),

        // PUT /students/:id
        updateStudent: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/students/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }, 'Student'],
        }),

        // DELETE /students/:id
        deleteStudent: builder.mutation({
            query: (id) => ({
                url: `/students/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Student'],
        }),

        // PATCH /students/:id/status
        updateStudentStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/students/${id}/status`,
                method: 'PATCH',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }, 'Student'],
        }),

        // POST /students/promote
        promoteStudents: builder.mutation({
            query: (data) => ({
                url: '/students/promote',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Student'],
        }),

        // GET /students/:id/attendance
        getAttendanceSummary: builder.query({
            query: ({ id, term, session } = {}) => ({
                url: `/students/${id}/attendance`,
                method: 'GET',
                params: { term, session },
            }),
            providesTags: (result, error, { id }) => [{ type: 'Student', id }],
        }),
    }),
});

export const {
    useGetAllStudentsQuery,
    useGetStudentQuery,
    useAddStudentMutation,
    useUpdateStudentMutation,
    useDeleteStudentMutation,
    useUpdateStudentStatusMutation,
    usePromoteStudentsMutation,
    useGetAttendanceSummaryQuery,
} = studentApi;
