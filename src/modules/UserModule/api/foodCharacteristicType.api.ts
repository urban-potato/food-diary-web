import { api } from "../../../global/api/api";

const foodCharacteristicTypeApi = api.injectEndpoints({
  endpoints: (builder) => ({
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
      query: ({ data, isInvalidationNeeded }) => ({
        body: data,
        url: "/api/foodcharacteristictype",
        method: "POST",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "FoodCharacteristicTypes" }] : [],
    }),

    changeFoodCharacteristicTypeName: builder.mutation({
      query: ({ foodCharacteristicTypeId, data, isInvalidationNeeded }) => ({
        body: data,
        url: `/api/foodcharacteristictype/${foodCharacteristicTypeId}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "FoodCharacteristicTypes" }] : [],
    }),

    deleteFoodCharacteristicType: builder.mutation({
      query: ({ foodCharacteristicTypeId, isInvalidationNeeded }) => ({
        url: `/api/foodcharacteristictype/${foodCharacteristicTypeId}`,
        method: "DELETE",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "FoodCharacteristicTypes" }] : [],
    }),
  }),
});

export const {
  useGetAllFoodCharacteristicTypesQuery,
  useCreateFoodCharacteristicTypeMutation,
  useChangeFoodCharacteristicTypeNameMutation,
  useDeleteFoodCharacteristicTypeMutation,
} = foodCharacteristicTypeApi;
