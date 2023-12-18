import { RouterProvider } from "react-router-dom";
import { router } from "./global/routes/routes";
import { useAppDispatch } from "./global/store/hooks";
import { useIsAuth } from "./modules/AuthorizationModule/index";
import { login } from "./modules/UserModule/index";
import { useEffect, useRef } from "react";
import { getTokenFromLocalStorage } from "./global/helpers/local_storage.helper";
import { Player } from "@lordicon/react";
import PRELOADER from "./global/assets/system-regular-18-autorenew.json";
import { useGetMeQuery } from "./modules/AuthorizationModule/api/auth.api";
import { useGetUserInfoQuery } from "./modules/UserModule/api/user.api";

function App() {
  const dispatch = useAppDispatch();
  let isAuth = useIsAuth();

  const {
    isLoading: isLoadingGetMeQuery,
    data: dataGetMeQuery,
    error: errorGetMeQuery,
  } = useGetMeQuery(undefined);

  const {
    isLoading: isLoadingGetUserInfo,
    data: dataGetUserInfo,
    error: errorGetUserInfo,
  } = useGetUserInfoQuery(dataGetMeQuery?.id);

  const preloaderPlayerRef = useRef<Player>(null);

  const checkAuth = async () => {
    const token = getTokenFromLocalStorage();
    if (token) {
      dispatch(
        login({
          id: dataGetUserInfo?.id,
          email: dataGetUserInfo?.email,
          firstName: dataGetUserInfo?.firstName,
          lastName: dataGetUserInfo?.lastName,
        })
      );

      isAuth = useIsAuth();
    }
  };

  useEffect(() => {
    preloaderPlayerRef.current?.playFromBeginning();
    checkAuth();
  }, [isAuth]);

  return (
    <>
      {isLoadingGetMeQuery || isLoadingGetUserInfo ? (
        <span className="flex justify-center items-center h-screen w-full">
          <Player
            ref={preloaderPlayerRef}
            icon={PRELOADER}
            size={100}
            colorize="#0d0b26"
            onComplete={() => preloaderPlayerRef.current?.playFromBeginning()}
          />
        </span>
      ) : (
        <RouterProvider router={router} />
      )}
    </>
  );
}

export default App;
