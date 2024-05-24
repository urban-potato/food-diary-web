import { api } from "../../../global/api/api";

const mealsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // getCourseMealDay: builder.query({
    //   query: (id) => ({
    //     url: `/api/coursemealday/${id}`,
    //     credentials: "same-origin",
    //   }),
    // }),

    // getAllCourseMealDays: builder.query({
    //   query: () => ({
    //     url: `/api/coursemealday`,
    //     credentials: "same-origin",
    //   }),
    // }),

    getCourseMealDayByDate: builder.query({
      query: (date) => ({
        url: `/api/coursemealday?CourseMealDayDate=${date}`,
        credentials: "same-origin",
      }),

      // providesTags: (result, error, arg) => {
      //   console.log("getCourseMealDayByDate result", result);
      //   const mealTags =
      //     result.items.length > 0
      //       ? result.items[0].courseMeals.map((meal) => {
      //           return { type: "Meal" as const, id: meal.id };
      //         })
      //       : [];

      //   // return result.items.length > 0
      //   //   ? [{ type: "Diary" as const, id: result.items[0].id }, ...mealTags]
      //   //   : ["Diary"];

      //   // return result.items.length > 0
      //   //   ? [{ type: "Diary" as const, id: result.items[0].id }, ...mealTags]
      //   //   : [];

      //   return result.items.length > 0
      //     ? [{ type: "Diary" as const }, ...mealTags]
      //     : ["Diary"];
      // },

      providesTags: (result, error, arg) => [
        {
          type: "Diary",
        },
        // {
        //   type: "Meal",
        //   id: data.items
        // },
      ],

      // async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
      //   const { data } = await queryFulfilled;

      //   for (const meal of data.items[0].courseMeals) {
      //     dispatch(
      //       api.util.updateQueryData("Meal", meal.id, (draft) => {
      //         Object.assign(draft, meal);
      //       })
      //     );
      //   }
      // },
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

      // invalidatesTags: (result, error, arg) => [{ type: "Diary", id: result }],

      // async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
      //   const { data } = await queryFulfilled;

      //   dispatch(
      //     api.util.updateQueryData("Diary", data, (draft) => {
      //       Object.assign(draft, data);
      //     })
      //   );
      // },
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

      // invalidatesTags: () => [
      //   {
      //     type: "Diary",
      //   },
      // ],
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
        // {
        //   type: "Diary",
        //   id: courseMealId,
        // },
      ],

      // async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
      //   const { data } = await queryFulfilled;

      //   dispatch(
      //     api.util.updateQueryData("Meal", id, (draft) => {
      //       Object.assign(draft, data);
      //     })
      //   );
      // },
    }),

    addConsumedElementary: builder.mutation({
      query: ({ id, data }) => ({
        body: data,
        url: `/api/coursemeal/${id}/addfoodelementary`,
        method: "PUT",
        credentials: "same-origin",
      }),

      // invalidatesTags: () => [
      //   {
      //     type: "Diary",
      //   },
      // ],

      // invalidatesTags: (result, error, arg) => {
      //   console.log("addConsumedElementary arg", arg);

      //   return [
      //     {
      //       type: "Meal",
      //       id: arg.id,
      //     },
      //   ];
      // },

      // async onQueryStarted({ id, patch }, { dispatch, queryFulfilled }) {
      //   console.log("id", id);
      //   console.log("patch", patch);

      //   const { data } = await queryFulfilled;

      //   dispatch(
      //     api.util.updateQueryData("Meal", id, (draft) => {
      //       Object.assign(draft, patch);
      //     })
      //   );
      // },
    }),

    addConsumedRecipe: builder.mutation({
      query: ({ id, data }) => ({
        body: data,
        url: `/api/coursemeal/${id}/addrecipe`,
        method: "PUT",
        credentials: "same-origin",
      }),

      // invalidatesTags: () => [
      //   {
      //     type: "Diary",
      //   },
      // ],
    }),

    changeConsumedElementaryWeight: builder.mutation({
      query: ({ courseMealId, foodElementaryId, data }) => ({
        body: data,
        url: `/api/coursemeal/${courseMealId}/consumedelementaries/${foodElementaryId}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      // invalidatesTags: () => [
      //   {
      //     type: "Diary",
      //   },
      // ],
    }),

    changeConsumedRecipeWeight: builder.mutation({
      query: ({ courseMealId, foodRecipeId, data }) => ({
        body: data,
        url: `/api/coursemeal/${courseMealId}/consumedrecipes/${foodRecipeId}`,
        method: "PUT",
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

    deleteConsumedRecipe: builder.mutation({
      query: ({ courseMealId, foodRecipeId }) => ({
        url: `/api/coursemeal/${courseMealId}/consumedrecipes/${foodRecipeId}`,
        method: "DELETE",
        credentials: "same-origin",
      }),

      // invalidatesTags: () => [
      //   {
      //     type: "Diary",
      //   },
      // ],
    }),
  }),
});

export const {
  useCreateCourseMealDayMutation,
  useCreateCourseMealMutation,
  // useGetCourseMealDayQuery,
  // useLazyGetCourseMealDayQuery,
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
