import { useGetUserInfoQuery, useLazyGetUserInfoQuery } from "./api/user.api";
import UserProfile from "./components/UserProfile.tsx";
import { useGetUserInfo } from "./hooks/hooks.ts";
import { login, logout } from "./slices/userSlice";

export { useLazyGetUserInfoQuery, useGetUserInfoQuery, login, logout, UserProfile, useGetUserInfo };
