import { api } from "../../../global/api/api";
import { IUserAuthData, loginResponseType } from "../types/types";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<void, IUserAuthData>({
      query: (userData) => ({
        body: userData,
        url: "/api/register",
        method: "POST",
      }),
    }),

    login: builder.mutation<loginResponseType, IUserAuthData>({
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

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;
