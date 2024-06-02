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
        arg.isInvalidationNeeded
          ? [
              { type: "FoodCharacteristicTypes" },
              { type: "FoodRecipesList" },
              { type: "Diary" },
            ]
          : [],
    }),

    changeFoodCharacteristicTypeName: builder.mutation({
      query: ({ foodCharacteristicTypeId, data, isInvalidationNeeded }) => ({
        body: data,
        url: `/api/foodcharacteristictype/${foodCharacteristicTypeId}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded
          ? [
              { type: "FoodCharacteristicTypes" },
              { type: "FoodElementaryList" },
              { type: "FoodRecipesList" },
              { type: "Diary" },
            ]
          : [],
    }),

    deleteFoodCharacteristicType: builder.mutation({
      query: ({ foodCharacteristicTypeId, isInvalidationNeeded }) => ({
        url: `/api/foodcharacteristictype/${foodCharacteristicTypeId}`,
        method: "DELETE",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded
          ? [
              { type: "FoodCharacteristicTypes" },
              { type: "FoodRecipesList" },
              { type: "Diary" },
            ]
          : [],
    }),
  }),
});

export const {
  useGetAllFoodCharacteristicTypesQuery,
  useCreateFoodCharacteristicTypeMutation,
  useChangeFoodCharacteristicTypeNameMutation,
  useDeleteFoodCharacteristicTypeMutation,
} = foodCharacteristicTypeApi;
