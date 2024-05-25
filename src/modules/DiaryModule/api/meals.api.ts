import { api } from "../../../global/api/api";

const mealsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourseMealDayByDate: builder.query({
      query: (date) => ({
        url: `/api/coursemealday?CourseMealDayDate=${date}`,
        credentials: "same-origin",
      }),

      providesTags: () => [
        {
          type: "Diary",
        },
      ],
    }),

    createCourseMealDay: builder.mutation({
      query: (data) => ({
        body: data,
        url: "/api/coursemealday",
        method: "POST",
        credentials: "same-origin",
      }),
    }),

    deleteCourseMeal: builder.mutation({
      query: (id) => ({
        url: `/api/coursemeal/${id}`,
        method: "DELETE",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "Diary",
        },
      ],
    }),

    createCourseMeal: builder.mutation({
      query: (data) => ({
        body: data,
        url: "/api/coursemeal",
        method: "POST",
        credentials: "same-origin",
      }),
    }),

    changeMealType: builder.mutation({
      query: ({ courseMealId, data }) => ({
        body: data,
        url: `/api/coursemeal/${courseMealId}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "Diary",
        },
      ],
    }),

    addConsumedElementary: builder.mutation({
      query: ({ id, data }) => ({
        body: data,
        url: `/api/coursemeal/${id}/addfoodelementary`,
        method: "PUT",
        credentials: "same-origin",
      }),
    }),

    addConsumedRecipe: builder.mutation({
      query: ({ id, data }) => ({
        body: data,
        url: `/api/coursemeal/${id}/addrecipe`,
        method: "PUT",
        credentials: "same-origin",
      }),
    }),

    changeConsumedElementaryWeight: builder.mutation({
      query: ({ courseMealId, foodElementaryId, data }) => ({
        body: data,
        url: `/api/coursemeal/${courseMealId}/consumedelementaries/${foodElementaryId}`,
        method: "PUT",
        credentials: "same-origin",
      }),
    }),

    changeConsumedRecipeWeight: builder.mutation({
      query: ({ courseMealId, foodRecipeId, data }) => ({
        body: data,
        url: `/api/coursemeal/${courseMealId}/consumedrecipes/${foodRecipeId}`,
        method: "PUT",
        credentials: "same-origin",
      }),
    }),

    deleteConsumedElementary: builder.mutation({
      query: ({ courseMealId, foodElementaryId }) => ({
        url: `/api/coursemeal/${courseMealId}/consumedelementaries/${foodElementaryId}`,
        method: "DELETE",
        credentials: "same-origin",
      }),
    }),

    deleteConsumedRecipe: builder.mutation({
      query: ({ courseMealId, foodRecipeId }) => ({
        url: `/api/coursemeal/${courseMealId}/consumedrecipes/${foodRecipeId}`,
        method: "DELETE",
        credentials: "same-origin",
      }),
    }),
  }),
});

export const {
  useCreateCourseMealDayMutation,
  useCreateCourseMealMutation,
  useGetCourseMealDayByDateQuery,
  useLazyGetCourseMealDayByDateQuery,
  useDeleteCourseMealMutation,
  useChangeMealTypeMutation,
  useAddConsumedElementaryMutation,
  useChangeConsumedElementaryWeightMutation,
  useDeleteConsumedElementaryMutation,
  useAddConsumedRecipeMutation,
  useChangeConsumedRecipeWeightMutation,
  useDeleteConsumedRecipeMutation,
} = mealsApi;
