import { api } from "../../../global/api/api";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: (id) => ({
        url: `/api/profile/${id}`,
        credentials: "same-origin",
      }),

      providesTags: () => [
        {
          type: "Profile",
        },
      ],
    }),

    changeUserInfo: builder.mutation({
      query: ({ id, data }) => ({
        body: data,
        url: `/api/profile/${id}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "Profile",
        },
      ],
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useLazyGetUserInfoQuery,
  useChangeUserInfoMutation,
} = userApi;
