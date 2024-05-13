import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokenFromLocalStorage } from "../helpers/local_storage.helper";

const baseURL = "http://localhost:5000/";

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["Profile", "FoodElementaryList", "Diary", "FoodRecipesList", "FoodCharacteristicTypes"],
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const token = getTokenFromLocalStorage();

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
    credentials: "same-origin",
  }),

  endpoints: () => ({}),
});
