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

    // getOneFoodRecipe: builder.query({
    //   query: (id) => ({
    //     url: `/api/foodrecipe/${id}`,
    //     credentials: "same-origin",
    //   }),
    // }),

    createFoodRecipe: builder.mutation({
      query: (data) => ({
        body: data,
        url: "/api/foodrecipe",
        method: "POST",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "FoodRecipesList",
        },
      ],
    }),

    changeFoodRecipeName: builder.mutation({
      query: ({ id, data }) => ({
        body: data,
        url: `/api/foodrecipe/${id}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "FoodRecipesList",
        },
      ],
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
      query: ({ foodRecipeId, data }) => ({
        body: data,
        url: `/api/foodrecipe/${foodRecipeId}/ingredients`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "FoodRecipesList",
        },
      ],
    }),

    changeElementaryWeight: builder.mutation({
      query: ({ foodRecipeId, foodElementaryId, data }) => ({
        body: data,
        url: `/api/foodrecipe/${foodRecipeId}/ingredients/${foodElementaryId}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "FoodRecipesList",
        },
      ],
    }),

    deleteElementary: builder.mutation({
      query: ({ foodRecipeId, foodElementaryId }) => ({
        url: `/api/foodrecipe/${foodRecipeId}/ingredients/${foodElementaryId}`,
        method: "DELETE",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "FoodRecipesList",
        },
      ],
    }),
  }),
});

export const {
  useGetAllFoodRecipeQuery,
  useCreateFoodRecipeMutation,
  useChangeFoodRecipeNameMutation,
  useDeleteFoodRecipeMutation,
  // useGetOneFoodRecipeQuery,
  useAddElementaryMutation,
  useChangeElementaryWeightMutation,
  useDeleteElementaryMutation,
} = foodRecipeApi;
