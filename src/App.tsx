import { RouterProvider } from "react-router-dom";
import { useAppDispatch } from "./global/store/store-hooks";
import { useGetMeQuery } from "./modules/AuthorizationForm";
import { login, logout, useGetUserInfoQuery } from "./modules/UserInfoTile";
import { useEffect } from "react";
import { getTokenFromLocalStorage } from "./global/helpers/local-storage.helper";
import { router } from "./global/router/router";
import Preloader from "./components/Preloader/Preloader";

function App() {
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
      dispatch(login(loginData));
    }

    if (!token) {
      dispatch(logout());
    }
  };

  useEffect(() => {
    loginLocally();
  }, [dataGetMeQuery, dataGetUserInfo]);

  return (
    <>
      {isLoadingGetMeQuery || isLoadingGetUserInfo ? (
        <span className="flex justify-center items-center h-screen w-full">
          <Preloader />
        </span>
      ) : (
        <RouterProvider router={router} />
      )}
    </>
  );
}

export default App;
