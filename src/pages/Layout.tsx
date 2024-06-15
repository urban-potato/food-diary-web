import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useLazyGetMeQuery } from "../modules/AuthorizationForm";
import { login, useLazyGetUserInfoQuery } from "../modules/UserInfoTile";
import { notify } from "../global/helpers/notify.helper";
import { useAppDispatch } from "../global/store/store-hooks";
import Preloader from "../components/Preloader/Preloader";
import Toaster from "../ui/Toaster/Toaster";

const Layout: FC = () => {
  const [endLoading, setEndLoading] = useState(false);
  const dispatch = useAppDispatch();

  const [doGetMe] = useLazyGetMeQuery();
  const [doGetUserInfo] = useLazyGetUserInfoQuery();

  useEffect(() => {
    doGetMe(undefined)
      .unwrap()
      .then((data) => {
        doGetUserInfo(data.id)
          .unwrap()
          .then((data) => {
            dispatch(login(data));
            setEndLoading(true);
          })
          .catch((error) => {
            setEndLoading(true);

            let errorMessage =
              "При получении данных пользователя произошла неизвестная ошибка :(";

            if (error?.status == "FETCH_ERROR") {
              errorMessage = "Проблемы с интернет соединением";
            }

            notify({
              messageText: errorMessage,
              toastId: "errorNotification",
              toastType: "error",
            });
          });
      })
      .catch((error) => {
        setEndLoading(true);

        let errorMessage = "При авторизации произошла неизвестная ошибка :(";

        if (error?.status == 403) {
          errorMessage = "Ошибка: 403 Forbidden";
        } else if (error?.status == "FETCH_ERROR") {
          errorMessage = "Проблемы с интернет соединением";
        }

        if (error?.status != 401) {
          notify({
            messageText: errorMessage,
            toastId: "errorNotification",
            toastType: "error",
          });
        }
      });
  }, []);

  return (
    <section className="min-h-screen h-full w-full max-w-full flex flex-col text-near_black bg-near_white text-base">
      {!endLoading ? (
        <span className="flex justify-center items-center h-screen w-full">
          <Preloader />
        </span>
      ) : (
        <>
          <Toaster />

          <section className="h-max">
            <Header />
          </section>

          <section className="h-full flex-grow flex flex-col justify-center items-center py-5 px-5">
            <Outlet />
          </section>

          <section className="h-max">
            <Footer />
          </section>
        </>
      )}
    </section>
  );
};

export default Layout;
