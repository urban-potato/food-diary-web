import { api } from "../../../global/api/api";

const foodCharacteristicApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addFoodCharacteristic: builder.mutation({
      query: (data) => ({
        body: data,
        url: "/api/foodcharacteristic",
        method: "POST",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "FoodElementaryList",
        },
      ],
    }),

    changeFoodCharacteristicValue: builder.mutation({
      query: ({ foodCharacteristicId, data }) => ({
        body: data,
        url: `/api/foodcharacteristic/${foodCharacteristicId}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "FoodElementaryList",
        },
      ],
    }),

    deleteFoodCharacteristic: builder.mutation({
      query: (foodCharacteristicId) => ({
        url: `/api/foodcharacteristic/${foodCharacteristicId}`,
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
  useAddFoodCharacteristicMutation,
  useChangeFoodCharacteristicValueMutation,
  useDeleteFoodCharacteristicMutation,
} = foodCharacteristicApi;
