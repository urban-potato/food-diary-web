import { api } from "../../../global/api/api";

const mealsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCourseMealDay: builder.mutation({
      query: (data) => ({
        body: data,
        url: "/api/coursemealday",
        method: "POST",
        credentials: "same-origin",
      }),
    }),

    getCourseMealDay: builder.query({
      query: (id) => ({
        url: `/api/coursemealday/${id}`,
        credentials: "same-origin",
      }),
    }),

    // createCourseMeal: builder.mutation({
    //   query: (data) => ({
    //     body: data,
    //     url: "/api/coursemeal",
    //     method: "POST",
    //     credentials: "same-origin",
    //   }),
    // }),

    changeCourseMealAddFoodElementary: builder.mutation({
      query: ({ id, data }) => ({
        body: data,
        url: `/api/coursemeal/${id}/addfoodelementary`,
        method: "PUT",
        credentials: "same-origin",
      }),
    }),
  }),
});

export const {
  useCreateCourseMealDayMutation,
  // useCreateCourseMealMutation,
  useGetCourseMealDayQuery,
  useLazyGetCourseMealDayQuery,
  useChangeCourseMealAddFoodElementaryMutation,
} = mealsApi;
