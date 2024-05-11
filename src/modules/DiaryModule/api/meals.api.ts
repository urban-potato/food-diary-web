import { api } from "../../../global/api/api";

const mealsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourseMealDay: builder.query({
      query: (id) => ({
        url: `/api/coursemealday/${id}`,
        credentials: "same-origin",
      }),
    }),

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

    // getAllCourseMealDays: builder.query({
    //   query: () => ({
    //     url: `/api/coursemealday`,
    //     credentials: "same-origin",
    //   }),
    // }),

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

      invalidatesTags: () => [
        {
          type: "Diary",
        },
      ],
    }),

    addConsumedRecipe: builder.mutation({
      query: ({ id, data }) => ({
        body: data,
        url: `/api/coursemeal/${id}/addrecipe`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "Diary",
        },
      ],
    }),

    changeConsumedElementaryWeight: builder.mutation({
      query: ({ courseMealId, foodElementaryId, data }) => ({
        body: data,
        url: `/api/coursemeal/${courseMealId}/consumedelementaries/${foodElementaryId}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "Diary",
        },
      ],
    }),

    changeConsumedRecipeWeight: builder.mutation({
      query: ({ courseMealId, foodRecipeId, data }) => ({
        body: data,
        url: `/api/coursemeal/${courseMealId}/consumedrecipes/${foodRecipeId}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "Diary",
        },
      ],
    }),

    deleteConsumedElementary: builder.mutation({
      query: ({ courseMealId, foodElementaryId }) => ({
        url: `/api/coursemeal/${courseMealId}/consumedelementaries/${foodElementaryId}`,
        method: "DELETE",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "Diary",
        },
      ],
    }),

    deleteConsumedRecipe: builder.mutation({
      query: ({ courseMealId, foodRecipeId }) => ({
        url: `/api/coursemeal/${courseMealId}/consumedrecipes/${foodRecipeId}`,
        method: "DELETE",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "Diary",
        },
      ],
    }),
  }),
});

export const {
  useCreateCourseMealDayMutation,
  useCreateCourseMealMutation,
  useGetCourseMealDayQuery,
  useLazyGetCourseMealDayQuery,
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
