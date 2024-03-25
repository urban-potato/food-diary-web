import { api } from "../../../global/api/api";

const mealsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourseMealDay: builder.query({
      query: (id) => ({
        url: `/api/coursemealday/${id}`,
        credentials: "same-origin",
      }),

      // providesTags: () => [
      //   {
      //     type: "Diary",
      //   },
      // ],
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

    createCourseMealDay: builder.mutation({
      query: (data) => ({
        body: data,
        url: "/api/coursemealday",
        method: "POST",
        credentials: "same-origin",
      }),

      // invalidatesTags: () => [
      //   {
      //     type: "Diary",
      //   },
      // ],
    }),

    deleteConsumedElementary: builder.mutation({
      query: ({ courseMealId, foodElementaryId }) => ({
        url: `/api/coursemeal/${courseMealId}/consumedelementaries/${foodElementaryId}`,
        method: "DELETE",
        credentials: "same-origin",
      }),

      // invalidatesTags: () => [
      //   {
      //     type: "Diary",
      //   },
      // ],
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

    // getAllCourseMealDays: builder.query({
    //   query: () => ({
    //     url: `/api/coursemealday`,
    //     credentials: "same-origin",
    //   }),
    // }),

    createCourseMeal: builder.mutation({
      query: (data) => ({
        body: data,
        url: "/api/coursemeal",
        method: "POST",
        credentials: "same-origin",
      }),

      // invalidatesTags: () => [
      //   {
      //     type: "Diary",
      //   },
      // ],
    }),

    changeCourseMealAddFoodElementary: builder.mutation({
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
  }),
});

export const {
  useCreateCourseMealDayMutation,
  useCreateCourseMealMutation,
  useGetCourseMealDayQuery,
  useLazyGetCourseMealDayQuery,
  useGetCourseMealDayByDateQuery,
  useLazyGetCourseMealDayByDateQuery,
  // useGetAllCourseMealDaysQuery,
  // useLazyGetAllCourseMealDaysQuery,
  useChangeCourseMealAddFoodElementaryMutation,
  useDeleteConsumedElementaryMutation,
  useDeleteCourseMealMutation,
} = mealsApi;
