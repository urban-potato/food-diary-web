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

    createFoodElementary: builder.mutation({
      query: ({ data, isInvalidationNeeded }) => ({
        body: data,
        url: "/api/foodelementary",
        method: "POST",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "FoodElementaryList" }] : [],
    }),

    changeFoodElementaryName: builder.mutation({
      query: ({ foodElementaryId, data, isInvalidationNeeded }) => ({
        body: data,
        url: `/api/foodelementary/${foodElementaryId}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "FoodElementaryList" }] : [],
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
  useCreateFoodElementaryMutation,
  useChangeFoodElementaryNameMutation,
  useDeleteFoodElementaryMutation,
} = foodElementaryApi;
