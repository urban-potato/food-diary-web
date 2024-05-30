import { useAppSelector } from "../../../global/store/store-hooks";

export const useGetUserInfo = () => {
  const userInfo = useAppSelector((state) => {
    return state.user.userInfo;
  });

  return userInfo;
};
