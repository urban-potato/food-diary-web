import { api } from "../../../global/api/api";

const mealsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllMealTypes: builder.query({
      query: () => ({
        url: "/api/mealtype",
        credentials: "same-origin",
      }),
    }),
  }),
});

export const { useGetAllMealTypesQuery } = mealsApi;
