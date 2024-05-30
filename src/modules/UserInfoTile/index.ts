import { useGetAllFoodCharacteristicTypesQuery } from "../FoodCharacteristicTypesInfoTile/api/food-characteristic-type.api.ts";
import {
  useGetUserInfoQuery,
  useLazyGetUserInfoQuery,
} from "./api/profile.api.ts";
import UserInfoTile from "./components/UserInfoTile.tsx";
import { useGetUserInfo } from "./hooks/use-get-user-info.hook.ts";
import { login, logout } from "./slices/user-slice.ts";
import userReducer from "./slices/user-slice.ts";

export {
  useLazyGetUserInfoQuery,
  useGetUserInfoQuery,
  login,
  logout,
  useGetUserInfo,
  userReducer,
  useGetAllFoodCharacteristicTypesQuery,
  UserInfoTile,
};
