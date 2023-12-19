import { RouterProvider } from "react-router-dom";
import { router } from "./global/routes/routes";
import { useAppDispatch } from "./global/store/hooks";
import {
  useIsAuth,
  useGetMeQuery,
} from "./modules/AuthorizationRegistrationForms";
import { login, useGetUserInfoQuery } from "./modules/UserModule";
import { useEffect, useRef, useState } from "react";
import { getTokenFromLocalStorage } from "./global/helpers/local_storage.helper";
import { Player } from "@lordicon/react";

import PRELOADER from "./global/assets/system-regular-18-autorenew.json";

function App() {
  const dispatch = useAppDispatch();
  // let isAuth = useIsAuth();
  let [isAuth, setIsAuth] = useState(useIsAuth());

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

    let loginData = {
      id: dataGetUserInfo?.id,
      email: dataGetUserInfo?.email,
      firstName: dataGetUserInfo?.firstName,
      lastName: dataGetUserInfo?.lastName,
    };

    if (token) {
      dispatch(login(loginData));
      setIsAuth(useIsAuth());
      // window.location.reload();
    }
  };

  useEffect(() => {
    preloaderPlayerRef.current?.playFromBeginning();
    checkAuth();
  }, [isAuth, dataGetMeQuery, dataGetUserInfo]);

  return (
    <>
      {isLoadingGetMeQuery ? (
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
