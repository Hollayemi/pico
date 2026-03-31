import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../api/axiosBaseQuery';


export const parentAdmissionsApi = createApi({
    reducerPath: 'parentAdmissionsApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['ParentAdmission'],
    endpoints: (builder) => ({

        // GET /parent/admissions
        getMyApplications: builder.query({
            query: () => ({
                url: '/parent/admissions',
                method: 'GET',
            }),
            providesTags: (result) =>
                result?.data?.applications
                    ? [
                          ...result.data.applications.map(({ id }) => ({
                              type: 'ParentAdmission',
                              id,
                          })),
                          { type: 'ParentAdmission', id: 'LIST' },
                      ]
                    : [{ type: 'ParentAdmission', id: 'LIST' }],
        }),

        // GET /parent/admissions/:id
        getMyApplication: builder.query({
            query: (id) => ({
                url: `/parent/admissions/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'ParentAdmission', id }],
        }),

        // POST /parent/admissions
        submitApplication: builder.mutation({
            query: (data) => ({
                url: '/parent/admissions',
                method: 'POST',
                data,
                skipSuccessToast: true, // parent page handles its own success UI
            }),
            invalidatesTags: [{ type: 'ParentAdmission', id: 'LIST' }],
        }),

        // PATCH /parent/admissions/:id/offer
        respondToOffer: builder.mutation({
            query: ({ id, acceptanceStatus }) => ({
                url: `/parent/admissions/${id}/offer`,
                method: 'PATCH',
                data: { acceptanceStatus },
                skipSuccessToast: true,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'ParentAdmission', id },
                { type: 'ParentAdmission', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetMyApplicationsQuery,
    useGetMyApplicationQuery,
    useSubmitApplicationMutation,
    useRespondToOfferMutation,
} = parentAdmissionsApi;
