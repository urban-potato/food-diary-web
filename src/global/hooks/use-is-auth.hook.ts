import { useAppSelector } from "../store/store-hooks";

export const useIsAuth = (): boolean => {
  const isAuth = useAppSelector((state) => {
    return state.user.isAuth;
  });

  return isAuth;
};
