import { useAppSelector } from "../../../global/store/hooks";

export const useIsAuth = (): boolean => {
  const isAuth = useAppSelector((state) => {
    console.log(state.user);
    return state.user.isAuth;
  });

  return isAuth;
};
