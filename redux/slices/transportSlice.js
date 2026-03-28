import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const transportApi = createApi({
    reducerPath: 'transportApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['BusRoute', 'BusEnrollment', 'SpecialTrip', 'TransportStats'],
    endpoints: (builder) => ({

        // ─── 4.12 GET TRANSPORT SUMMARY STATS ─────────────────────────────────
        // GET /transport/stats
        // Returns: { data: { busEnrollments: { total, paid, partial, unpaid,
        //   totalExpected, totalCollected, collectionRate }, trips: { total, open, closed, cancelled } } }
        getTransportStats: builder.query({
            query: () => ({
                url: '/transport/stats',
                method: 'GET',
            }),
            providesTags: ['TransportStats'],
        }),

        // ─── 4.1 GET ALL BUS ROUTES ────────────────────────────────────────────
        // GET /transport/routes
        // Returns: { data: { routes: [{ id, name, stops, fee, active, enrolledCount }] } }
        getAllRoutes: builder.query({
            query: () => ({
                url: '/transport/routes',
                method: 'GET',
            }),
            providesTags: ['BusRoute'],
        }),

        // ─── 4.2 CREATE BUS ROUTE ─────────────────────────────────────────────
        // POST /transport/routes
        // Body: { name, stops, fee, active }
        createRoute: builder.mutation({
            query: (data) => ({
                url: '/transport/routes',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['BusRoute', 'TransportStats'],
        }),

        // ─── 4.3 UPDATE BUS ROUTE ─────────────────────────────────────────────
        // PUT /transport/routes/:id
        // Body: partial fields
        updateRoute: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/transport/routes/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'BusRoute', id }, 'BusRoute', 'TransportStats'],
        }),

        // ─── 4.4 DELETE BUS ROUTE ─────────────────────────────────────────────
        // DELETE /transport/routes/:id
        // Error 409 if route has active enrollments
        deleteRoute: builder.mutation({
            query: (id) => ({
                url: `/transport/routes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['BusRoute', 'TransportStats'],
        }),

        // ─── 4.5 GET ALL BUS ENROLLMENTS ──────────────────────────────────────
        // GET /transport/enrollments
        // Returns: { data: { enrollments: [...], stats: { total, paid, partial, unpaid,
        //   totalExpected, totalCollected }, pagination } }
        getAllEnrollments: builder.query({
            query: ({ page, limit, search, routeId, payStatus } = {}) => ({
                url: '/transport/enrollments',
                method: 'GET',
                params: { page, limit, search, routeId, payStatus },
            }),
            providesTags: ['BusEnrollment'],
        }),

        // ─── 4.6 ENROLL STUDENT FOR BUS ───────────────────────────────────────
        // POST /transport/enrollments
        // Body: { studentId, routeId, stop, term? }
        enrollStudent: builder.mutation({
            query: (data) => ({
                url: '/transport/enrollments',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['BusEnrollment', 'BusRoute', 'TransportStats'],
        }),

        // ─── 4.7 REMOVE BUS ENROLLMENT ────────────────────────────────────────
        // DELETE /transport/enrollments/:studentId?term=
        removeEnrollment: builder.mutation({
            query: ({ studentId, term }) => ({
                url: `/transport/enrollments/${studentId}`,
                method: 'DELETE',
                params: { term },
            }),
            invalidatesTags: ['BusEnrollment', 'BusRoute', 'TransportStats'],
        }),

        // ─── 4.8 GET ALL SPECIAL TRIPS ────────────────────────────────────────
        // GET /transport/trips
        // Returns: { data: { trips: [{ id, name, date, destination, fee, capacity,
        //   enrolled, status, description, targetClasses, paidCount, unpaidCount,
        //   totalExpected, totalCollected }] } }
        getAllTrips: builder.query({
            query: ({ status } = {}) => ({
                url: '/transport/trips',
                method: 'GET',
                params: { status },
            }),
            providesTags: ['SpecialTrip'],
        }),

        // ─── 4.9 CREATE SPECIAL TRIP ──────────────────────────────────────────
        // POST /transport/trips
        // Body: { name, date, destination, fee, capacity, description?, targetClasses?, status? }
        createTrip: builder.mutation({
            query: (data) => ({
                url: '/transport/trips',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['SpecialTrip', 'TransportStats'],
        }),

        // ─── 4.10 UPDATE SPECIAL TRIP ─────────────────────────────────────────
        // PUT /transport/trips/:id  (partial)
        updateTrip: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/transport/trips/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'SpecialTrip', id }, 'SpecialTrip', 'TransportStats'],
        }),

        // ─── 4.11 DELETE SPECIAL TRIP ─────────────────────────────────────────
        // DELETE /transport/trips/:id — also removes all enrollment records
        deleteTrip: builder.mutation({
            query: (id) => ({
                url: `/transport/trips/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['SpecialTrip', 'TransportStats'],
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
