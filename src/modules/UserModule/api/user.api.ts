import { api } from "../../../global/api/api";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: (id) => ({
        url: `/api/profile/${id}`,
        credentials: "same-origin",
      }),
    }),
  }),
});

export const { useGetUserInfoQuery, useLazyGetUserInfoQuery } = userApi;
