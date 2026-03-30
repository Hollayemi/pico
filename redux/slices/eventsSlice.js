import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const eventsApi = createApi({
    reducerPath: 'eventsApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Event'],
    endpoints: (builder) => ({

        // GET /events
        getAllEvents: builder.query({
            query: ({ page, limit, search, type, status, requiresPayment } = {}) => ({
                url: '/events',
                method: 'GET',
                params: { page, limit, search, type, status, requiresPayment },
            }),
            providesTags: ['Event'],
        }),

        // GET /events/:id
        getEvent: builder.query({
            query: (id) => ({
                url: `/events/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Event', id }],
        }),

        // POST /events (Admin)
        createEvent: builder.mutation({
            query: (data) => ({
                url: '/events',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Event'],
        }),

        // PUT /events/:id (Admin)
        updateEvent: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/events/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Event', id }, 'Event'],
        }),

        // DELETE /events/:id (Admin)
        deleteEvent: builder.mutation({
            query: (id) => ({
                url: `/events/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Event'],
        }),

        // POST /events/:id/notify — push notification to parents
        notifyParents: builder.mutation({
            query: (id) => ({
                url: `/events/${id}/notify`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Event', id }],
        }),
    }),
});

export const {
    useGetAllEventsQuery,
    useGetEventQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
    useNotifyParentsMutation,
} = eventsApi;
