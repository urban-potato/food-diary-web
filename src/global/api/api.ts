import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokenFromLocalStorage } from "../helpers/local-storage.helper";

const baseURL = "http://localhost:5000/";
// const baseURL = "https://8054-193-218-138-73.ngrok-free.app";

export const api = createApi({
  reducerPath: "api",
  tagTypes: [
    "Profile",
    "FoodElementaryList",
    "Diary",
    "FoodRecipesList",
    "FoodCharacteristicTypes",
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const token = getTokenFromLocalStorage();

      headers.set("ngrok-skip-browser-warning", "hehe");

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
