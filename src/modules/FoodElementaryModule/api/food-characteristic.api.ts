import { api } from "../../../global/api/api";

const foodCharacteristicApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addFoodCharacteristic: builder.mutation({
      query: ({ data, isInvalidationNeeded }) => ({
        body: data,
        url: "/api/foodcharacteristic",
        method: "POST",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "FoodElementaryList" }] : [],
    }),

    changeFoodCharacteristicValue: builder.mutation({
      query: ({ foodCharacteristicId, data, isInvalidationNeeded }) => ({
        body: data,
        url: `/api/foodcharacteristic/${foodCharacteristicId}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "FoodElementaryList" }] : [],
    }),

    deleteFoodCharacteristic: builder.mutation({
      query: ({ foodCharacteristicId, isInvalidationNeeded }) => ({
        url: `/api/foodcharacteristic/${foodCharacteristicId}`,
        method: "DELETE",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "FoodElementaryList" }] : [],
    }),
  }),
});

export const {
  useAddFoodCharacteristicMutation,
  useChangeFoodCharacteristicValueMutation,
  useDeleteFoodCharacteristicMutation,
} = foodCharacteristicApi;
