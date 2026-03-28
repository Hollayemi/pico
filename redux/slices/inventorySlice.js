import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const inventoryApi = createApi({
    reducerPath: 'inventoryApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['InventoryItem'],
    endpoints: (builder) => ({

        // GET /inventory/summary  (declared before /:id to match server route order)
        getInventorySummary: builder.query({
            query: () => ({
                url: '/inventory/summary',
                method: 'GET',
            }),
            providesTags: ['InventoryItem'],
        }),

        // GET /inventory
        getAllItems: builder.query({
            query: ({ page, limit, search, locationType, location, category, condition } = {}) => ({
                url: '/inventory',
                method: 'GET',
                params: { page, limit, search, locationType, location, category, condition },
            }),
            providesTags: ['InventoryItem'],
        }),

        // GET /inventory/:id
        getItemById: builder.query({
            query: (id) => ({
                url: `/inventory/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'InventoryItem', id }],
        }),

        // POST /inventory
        createItem: builder.mutation({
            query: (data) => ({
                url: '/inventory',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['InventoryItem'],
        }),

        // PUT /inventory/:id
        updateItem: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/inventory/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'InventoryItem', id }, 'InventoryItem'],
        }),

        // DELETE /inventory/:id
        deleteItem: builder.mutation({
            query: (id) => ({
                url: `/inventory/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['InventoryItem'],
        }),
    }),
});

export const {
    useGetInventorySummaryQuery,
    useGetAllItemsQuery,
    useGetItemByIdQuery,
    useCreateItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
} = inventoryApi;
