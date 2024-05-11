import { api } from "../../../global/api/api";

const foodElementaryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllFoodElementary: builder.query({
      query: () => ({
        url: "/api/foodelementary",
        credentials: "same-origin",
      }),

      providesTags: () => [
        {
          type: "FoodElementaryList",
        },
      ],
    }),

    getOneFoodElementary: builder.query({
      query: (id) => ({
        url: `/api/foodelementary/${id}`,
        credentials: "same-origin",
      }),
    }),

    createFoodElementary: builder.mutation({
      query: (data) => ({
        body: data,
        url: "/api/foodelementary",
        method: "POST",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "FoodElementaryList",
        },
      ],
    }),

    changeFoodElementaryName: builder.mutation({
      query: ({ id, data }) => ({
        body: data,
        url: `/api/foodelementary/${id}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "FoodElementaryList",
        },
      ],
    }),

    deleteFoodElementary: builder.mutation({
      query: (id) => ({
        url: `/api/foodelementary/${id}`,
        method: "DELETE",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "FoodElementaryList",
        },
      ],
    }),
  }),
});

export const {
  useGetAllFoodElementaryQuery,
  useGetOneFoodElementaryQuery,
  useCreateFoodElementaryMutation,
  useChangeFoodElementaryNameMutation,
  useDeleteFoodElementaryMutation,
} = foodElementaryApi;
