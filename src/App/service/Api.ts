

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
    reducerPath: "products",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: () => "products"
        }),
        // getProductById: builder.query({
        //     query: (id) => `products/${id}`
        // })
        authUser: builder.mutation({
            query: (data) => ({
                url: "/login",
                method: "POST",
                body: data
            })
        })
    })
})

export const { useGetAllProductsQuery, useAuthUserMutation } = productApi