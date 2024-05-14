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
      query: (foodElementaryId) => ({
        url: `/api/foodelementary/${foodElementaryId}`,
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
      query: ({ foodElementaryId, data }) => ({
        body: data,
        url: `/api/foodelementary/${foodElementaryId}`,
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
      query: (foodElementaryId) => ({
        url: `/api/foodelementary/${foodElementaryId}`,
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
