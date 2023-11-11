import { RouterProvider } from "react-router-dom";
import { router } from "./global/routes/routes";
import { useAppDispatch } from "./global/store/hooks";
import {
  useLazyGetMeQuery,
  useIsAuth,
} from "./modules/AuthorizationModule/index";
import { useLazyGetUserInfoQuery, login } from "./modules/UserModule/index";
import { useEffect } from "react";
import { getTokenFromLocalStorage } from "./global/helpers/local_storage.helper";

function App() {
  const dispatch = useAppDispatch();
  const [doGetMe, doGetMeResult] = useLazyGetMeQuery();
  const [doGetUserInfo, doGetUserInfoResult] = useLazyGetUserInfoQuery();
  let isAuth = useIsAuth();

  const checkAuth = async () => {
    const token = getTokenFromLocalStorage();
    if (token) {
      doGetMe(undefined)
        .unwrap()
        .then((data) => {
          doGetUserInfo(data.id)
            .unwrap()
            .then((data) => {
              dispatch(login(data));

              isAuth = useIsAuth();
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    }
  };

  useEffect(() => {
    checkAuth();
  }, [isAuth]);

  return <RouterProvider router={router} />;
}

export default App;
