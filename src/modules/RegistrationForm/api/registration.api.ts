import { api } from "../../../global/api/api";

type RegistrationData = {
  email: string;
  password: string;
};

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<void, RegistrationData>({
      query: (userData) => ({
        body: userData,
        url: "/api/register",
        method: "POST",
      }),
    }),
  }),
});

export const { useRegisterMutation } = authApi;
