import { api } from "../../../global/api/api";

const foodRecipeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllFoodRecipe: builder.query({
      query: () => ({
        url: "/api/foodrecipe",
        credentials: "same-origin",
      }),

      providesTags: () => [
        {
          type: "FoodRecipesList",
        },
      ],
    }),

    createFoodRecipe: builder.mutation({
      query: ({ data, isInvalidationNeeded }) => ({
        body: data,
        url: "/api/foodrecipe",
        method: "POST",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "FoodRecipesList" }] : [],
    }),

    changeFoodRecipeName: builder.mutation({
      query: ({ id, data, isInvalidationNeeded }) => ({
        body: data,
        url: `/api/foodrecipe/${id}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "FoodRecipesList" }] : [],
    }),

    deleteFoodRecipe: builder.mutation({
      query: (id) => ({
        url: `/api/foodrecipe/${id}`,
        method: "DELETE",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "FoodRecipesList",
        },
      ],
    }),

    addElementary: builder.mutation({
      query: ({ foodRecipeId, data, isInvalidationNeeded }) => ({
        body: data,
        url: `/api/foodrecipe/${foodRecipeId}/ingredients`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "FoodRecipesList" }] : [],
    }),

    changeElementaryWeight: builder.mutation({
      query: ({
        foodRecipeId,
        foodElementaryId,
        data,
        isInvalidationNeeded,
      }) => ({
        body: data,
        url: `/api/foodrecipe/${foodRecipeId}/ingredients/${foodElementaryId}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "FoodRecipesList" }] : [],
    }),

    deleteElementary: builder.mutation({
      query: ({ foodRecipeId, foodElementaryId, isInvalidationNeeded }) => ({
        url: `/api/foodrecipe/${foodRecipeId}/ingredients/${foodElementaryId}`,
        method: "DELETE",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "FoodRecipesList" }] : [],
    }),
  }),
});

export const {
  useGetAllFoodRecipeQuery,
  useCreateFoodRecipeMutation,
  useChangeFoodRecipeNameMutation,
  useDeleteFoodRecipeMutation,
  useAddElementaryMutation,
  useChangeElementaryWeightMutation,
  useDeleteElementaryMutation,
} = foodRecipeApi;
