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
          type: "FoodList",
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
          type: "FoodList",
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
          type: "FoodList",
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
          type: "FoodList",
        },
      ],
    }),

    getOneFoodCharacteristicType: builder.query({
      query: (id) => ({
        url: `/api/foodcharacteristictype/${id}`,
        credentials: "same-origin",
      }),
    }),

    changeFoodCharacteristicValue: builder.mutation({
      query: ({ id, data }) => ({
        body: data,
        url: `/api/foodcharacteristic/${id}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "FoodList",
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
  useGetOneFoodCharacteristicTypeQuery,
  useChangeFoodCharacteristicValueMutation,
} = foodElementaryApi;
