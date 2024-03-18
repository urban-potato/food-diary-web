import { RouterProvider } from "react-router-dom";
import { router } from "./global/routes/routes";
import { useAppDispatch } from "./global/store/hooks";
import { useGetMeQuery } from "./modules/AuthorizationRegistrationForms";
import { login, logout, useGetUserInfoQuery } from "./modules/UserModule";
import { useEffect, useRef } from "react";
import { getTokenFromLocalStorage } from "./global/helpers/local_storage.helper";
import { Player } from "@lordicon/react";

import PRELOADER from "./global/assets/system-regular-18-autorenew.json";

function App() {
  const preloaderPlayerRef = useRef<Player>(null);
  const dispatch = useAppDispatch();

  const {
    isLoading: isLoadingGetMeQuery,
    data: dataGetMeQuery,
    isSuccess: isSuccessGetMeQuery,
  } = useGetMeQuery(undefined);

  const {
    isLoading: isLoadingGetUserInfo,
    data: dataGetUserInfo,
    isSuccess: isSuccessGetUserInfo,
  } = useGetUserInfoQuery(dataGetMeQuery?.id, { skip: !isSuccessGetMeQuery });

  const loginLocally = () => {
    const token = getTokenFromLocalStorage();

    let loginData = {
      id: dataGetUserInfo?.id,
      email: dataGetUserInfo?.email,
      firstName: dataGetUserInfo?.firstName,
      lastName: dataGetUserInfo?.lastName,
    };

    if (token && isSuccessGetUserInfo) {
      console.log("isSuccessGetUserInfo");
      console.log("loginData", loginData);
      console.log("token", token);

      dispatch(login(loginData));
    }

    if (!token) {
      dispatch(logout());
    }
  };

  useEffect(() => {
    preloaderPlayerRef.current?.playFromBeginning();
    loginLocally();
  }, [dataGetMeQuery, dataGetUserInfo]);

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
