import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

export const inventoryApi = createApi({
    reducerPath: 'inventoryApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['InventoryItem', 'InventorySummary'],
    endpoints: (builder) => ({

        // ─── 3.6 GET INVENTORY SUMMARY ────────────────────────────────────────
        // GET /inventory/summary  (must be declared BEFORE /:id)
        // Returns: { data: { totalItems, totalQuantity, locations, conditionBreakdown,
        //   categoryBreakdown, needsAttention } }
        getInventorySummary: builder.query({
            query: () => ({
                url: '/inventory/summary',
                method: 'GET',
            }),
            providesTags: ['InventorySummary'],
        }),

        // ─── 3.1 GET ALL INVENTORY ITEMS ──────────────────────────────────────
        // GET /inventory
        // Returns: { data: { items: [...], summary: { totalItems, totalQuantity,
        //   locations, needsAttention }, pagination } }
        getAllItems: builder.query({
            query: ({ page, limit, search, locationType, location, category, condition } = {}) => ({
                url: '/inventory',
                method: 'GET',
                params: { page, limit, search, locationType, location, category, condition },
            }),
            providesTags: ['InventoryItem'],
        }),

        // ─── 3.2 GET SINGLE INVENTORY ITEM ────────────────────────────────────
        // GET /inventory/:id
        // Returns: { data: { item: { id, name, category, location, locationType,
        //   quantity, unit, condition, lastUpdated, notes } } }
        getItemById: builder.query({
            query: (id) => ({
                url: `/inventory/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'InventoryItem', id }],
        }),

        // ─── 3.3 ADD INVENTORY ITEM ───────────────────────────────────────────
        // POST /inventory
        // Body: { name, category, location, locationType, quantity, unit, condition, notes? }
        createItem: builder.mutation({
            query: (data) => ({
                url: '/inventory',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['InventoryItem', 'InventorySummary'],
        }),

        // ─── 3.4 UPDATE INVENTORY ITEM ────────────────────────────────────────
        // PUT /inventory/:id  (partial updates allowed)
        // Body: any subset of { name, category, location, locationType, quantity, unit, condition, notes }
        updateItem: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/inventory/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'InventoryItem', id }, 'InventoryItem', 'InventorySummary'],
        }),

        // ─── 3.5 DELETE INVENTORY ITEM ────────────────────────────────────────
        // DELETE /inventory/:id
        deleteItem: builder.mutation({
            query: (id) => ({
                url: `/inventory/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['InventoryItem', 'InventorySummary'],
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
