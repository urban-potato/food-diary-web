import { api } from "../../../global/api/api";

const foodCharacteristicApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOneFoodCharacteristicType: builder.query({
      query: (id) => ({
        url: `/api/foodcharacteristictype/${id}`,
        credentials: "same-origin",
      }),
    }),

    changeFoodCharacteristicValue: builder.mutation({
      query: ({ id, data }) => ({
        body: data,
        url: `/api/foodcharacteristic/${id}`,
        method: "PUT",
        credentials: "same-origin",
      }),

      invalidatesTags: () => [
        {
          type: "FoodElementaryList",
        },
      ],
    }),
  }),
});

export const {
  useGetOneFoodCharacteristicTypeQuery,
  useChangeFoodCharacteristicValueMutation,
} = foodCharacteristicApi;
