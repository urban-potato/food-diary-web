import { useAppSelector } from "../../../global/store/hooks";

export const useIsAuth = (): boolean => {
  const isAuth = useAppSelector((state) => state.user.isAuth);
  return isAuth;
};
