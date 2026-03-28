import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const staffApi = createApi({
    reducerPath: 'staffApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Staff', 'Payroll'],
    endpoints: (builder) => ({

        // ─── STAFF ─────────────────────────────────────────────────────────────

        // GET /staff
        getAllStaff: builder.query({
            query: ({ page, limit, search, staffType, department, status } = {}) => ({
                url: '/staff',
                method: 'GET',
                params: { page, limit, search, staffType, department, status },
            }),
            providesTags: ['Staff'],
        }),

        // GET /staff/:id
        getStaff: builder.query({
            query: (id) => ({
                url: `/staff/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Staff', id }],
        }),

        // POST /staff
        addStaff: builder.mutation({
            query: (data) => ({
                url: '/staff',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Staff'],
        }),

        // PUT /staff/:id
        updateStaff: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/staff/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Staff', id }, 'Staff'],
        }),

        // DELETE /staff/:id
        deleteStaff: builder.mutation({
            query: (id) => ({
                url: `/staff/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Staff'],
        }),

        // PATCH /staff/:id/status
        updateStaffStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/staff/${id}/status`,
                method: 'PATCH',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Staff', id }, 'Staff'],
        }),

        // ─── PAYROLL ───────────────────────────────────────────────────────────

        // GET /staff/payroll
        getPayrollList: builder.query({
            query: ({ month, year, department, payStatus, page, limit } = {}) => ({
                url: '/staff/payroll',
                method: 'GET',
                params: { month, year, department, payStatus, page, limit },
            }),
            providesTags: ['Payroll'],
        }),

        // POST /staff/payroll/batch-process
        batchProcessPayroll: builder.mutation({
            query: (data) => ({
                url: '/staff/payroll/batch-process',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Payroll'],
        }),

        // POST /staff/payroll/:staffId/process
        processPayroll: builder.mutation({
            query: ({ staffId, ...data }) => ({
                url: `/staff/payroll/${staffId}/process`,
                method: 'POST',
                data,
            }),
            invalidatesTags: (result, error, { staffId }) => [
                { type: 'Payroll', id: staffId },
                'Payroll',
            ],
        }),

        // GET /staff/payroll/:staffId/payslip
        getPayslip: builder.query({
            query: ({ staffId, month, year }) => ({
                url: `/staff/payroll/${staffId}/payslip`,
                method: 'GET',
                params: { month, year },
            }),
            providesTags: (result, error, { staffId }) => [{ type: 'Payroll', id: staffId }],
        }),
    }),
});

export const {
    useGetAllStaffQuery,
    useGetStaffQuery,
    useAddStaffMutation,
    useUpdateStaffMutation,
    useDeleteStaffMutation,
    useUpdateStaffStatusMutation,
    useGetPayrollListQuery,
    useBatchProcessPayrollMutation,
    useProcessPayrollMutation,
    useGetPayslipQuery,
} = staffApi;
