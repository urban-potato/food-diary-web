import { api } from "../../../global/api/api";
import {
  AuthorizationData,
  LoginResponse,
} from "../types/AuthorizationForm.types";

const authorizationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, AuthorizationData>({
      query: (userData) => ({
        body: userData,
        url: "/api/auth",
        method: "POST",
        credentials: "same-origin",
      }),
    }),

    getMe: builder.query({
      query: () => ({
        url: "/api/auth",
        credentials: "same-origin",
      }),
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery, useLazyGetMeQuery } =
  authorizationApi;
