import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const transportApi = createApi({
    reducerPath: 'transportApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['BusRoute', 'BusEnrollment', 'SpecialTrip'],
    endpoints: (builder) => ({

        // ─── STATS ─────────────────────────────────────────────────────────────

        // GET /transport/stats
        getTransportStats: builder.query({
            query: () => ({
                url: '/transport/stats',
                method: 'GET',
            }),
            providesTags: ['BusRoute', 'BusEnrollment', 'SpecialTrip'],
        }),

        // ─── BUS ROUTES ────────────────────────────────────────────────────────

        // GET /transport/routes
        getAllRoutes: builder.query({
            query: () => ({
                url: '/transport/routes',
                method: 'GET',
            }),
            providesTags: ['BusRoute'],
        }),

        // POST /transport/routes
        createRoute: builder.mutation({
            query: (data) => ({
                url: '/transport/routes',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['BusRoute'],
        }),

        // PUT /transport/routes/:id
        updateRoute: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/transport/routes/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'BusRoute', id }, 'BusRoute'],
        }),

        // DELETE /transport/routes/:id
        deleteRoute: builder.mutation({
            query: (id) => ({
                url: `/transport/routes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['BusRoute'],
        }),

        // ─── BUS ENROLLMENTS ───────────────────────────────────────────────────

        // GET /transport/enrollments
        getAllEnrollments: builder.query({
            query: ({ page, limit, search, routeId, payStatus } = {}) => ({
                url: '/transport/enrollments',
                method: 'GET',
                params: { page, limit, search, routeId, payStatus },
            }),
            providesTags: ['BusEnrollment'],
        }),

        // POST /transport/enrollments
        enrollStudent: builder.mutation({
            query: (data) => ({
                url: '/transport/enrollments',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['BusEnrollment', 'BusRoute'],
        }),

        // DELETE /transport/enrollments/:studentId
        removeEnrollment: builder.mutation({
            query: ({ studentId, term }) => ({
                url: `/transport/enrollments/${studentId}`,
                method: 'DELETE',
                params: { term },
            }),
            invalidatesTags: ['BusEnrollment', 'BusRoute'],
        }),

        // ─── SPECIAL TRIPS ─────────────────────────────────────────────────────

        // GET /transport/trips
        getAllTrips: builder.query({
            query: ({ status } = {}) => ({
                url: '/transport/trips',
                method: 'GET',
                params: { status },
            }),
            providesTags: ['SpecialTrip'],
        }),

        // POST /transport/trips
        createTrip: builder.mutation({
            query: (data) => ({
                url: '/transport/trips',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['SpecialTrip'],
        }),

        // PUT /transport/trips/:id
        updateTrip: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/transport/trips/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'SpecialTrip', id }, 'SpecialTrip'],
        }),

        // DELETE /transport/trips/:id
        deleteTrip: builder.mutation({
            query: (id) => ({
                url: `/transport/trips/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['SpecialTrip'],
        }),
    }),
});

export const {
    useGetTransportStatsQuery,
    useGetAllRoutesQuery,
    useCreateRouteMutation,
    useUpdateRouteMutation,
    useDeleteRouteMutation,
    useGetAllEnrollmentsQuery,
    useEnrollStudentMutation,
    useRemoveEnrollmentMutation,
    useGetAllTripsQuery,
    useCreateTripMutation,
    useUpdateTripMutation,
    useDeleteTripMutation,
} = transportApi;
