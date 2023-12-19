import { useAppSelector } from "../../../global/store/hooks";

export const useGetUserInfo = () => {
  const userInfo = useAppSelector((state) => {
    console.log(state.user);
    return state.user.userInfo;
  });

  return userInfo;
};
