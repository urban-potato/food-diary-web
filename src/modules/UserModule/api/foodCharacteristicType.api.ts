import { api } from "../../../global/api/api";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOneFoodCharacteristicType: builder.query({
      query: (foodCharacteristicTypeId) => ({
        url: `/api/foodcharacteristictype/${foodCharacteristicTypeId}`,
        credentials: "same-origin",
      }),
    }),

    getAllFoodCharacteristicTypes: builder.query({
      query: () => ({
        url: `/api/foodcharacteristictype`,
        credentials: "same-origin",
      }),

      providesTags: () => [
        {
          type: "FoodCharacteristicTypes",
        },
      ],
    }),

    createFoodCharacteristicType: builder.mutation({
      query: (data) => ({
        body: data,
        url: "/api/foodcharacteristictype",
        method: "POST",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "FoodCharacteristicTypes",
        },
      ],
    }),

    changeFoodCharacteristicType: builder.mutation({
      query: ({ foodCharacteristicTypeId, data }) => ({
        body: data,
        url: `/api/foodcharacteristictype/${foodCharacteristicTypeId}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "FoodCharacteristicTypes",
        },
      ],
    }),

    deleteFoodCharacteristicType: builder.mutation({
      query: (foodCharacteristicTypeId) => ({
        url: `/api/foodcharacteristictype/${foodCharacteristicTypeId}`,
        method: "DELETE",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "FoodCharacteristicTypes",
        },
      ],
    }),
  }),
});

export const {
  useGetOneFoodCharacteristicTypeQuery,
  useGetAllFoodCharacteristicTypesQuery,
  useCreateFoodCharacteristicTypeMutation,
  useChangeFoodCharacteristicTypeMutation,
  useDeleteFoodCharacteristicTypeMutation,
} = userApi;
