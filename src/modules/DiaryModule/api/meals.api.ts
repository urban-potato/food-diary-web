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
      query: ({ courseMealId, data, isInvalidationNeeded }) => ({
        body: data,
        url: `/api/coursemeal/${courseMealId}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "Diary" }] : [],
    }),

    addConsumedElementary: builder.mutation({
      query: ({ id, data, isInvalidationNeeded }) => ({
        body: data,
        url: `/api/coursemeal/${id}/addfoodelementary`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "Diary" }] : [],
    }),

    addConsumedRecipe: builder.mutation({
      query: ({ id, data, isInvalidationNeeded }) => ({
        body: data,
        url: `/api/coursemeal/${id}/addrecipe`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "Diary" }] : [],
    }),

    changeConsumedElementaryWeight: builder.mutation({
      query: ({
        courseMealId,
        foodElementaryId,
        data,
        isInvalidationNeeded,
      }) => ({
        body: data,
        url: `/api/coursemeal/${courseMealId}/consumedelementaries/${foodElementaryId}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "Diary" }] : [],
    }),

    changeConsumedRecipeWeight: builder.mutation({
      query: ({ courseMealId, foodRecipeId, data, isInvalidationNeeded }) => ({
        body: data,
        url: `/api/coursemeal/${courseMealId}/consumedrecipes/${foodRecipeId}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "Diary" }] : [],
    }),

    deleteConsumedElementary: builder.mutation({
      query: ({ courseMealId, foodElementaryId, isInvalidationNeeded }) => ({
        url: `/api/coursemeal/${courseMealId}/consumedelementaries/${foodElementaryId}`,
        method: "DELETE",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "Diary" }] : [],
    }),

    deleteConsumedRecipe: builder.mutation({
      query: ({ courseMealId, foodRecipeId, isInvalidationNeeded }) => ({
        url: `/api/coursemeal/${courseMealId}/consumedrecipes/${foodRecipeId}`,
        method: "DELETE",
        credentials: "same-origin",
      }),

      invalidatesTags: (result, error, arg) =>
        arg.isInvalidationNeeded ? [{ type: "Diary" }] : [],
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
