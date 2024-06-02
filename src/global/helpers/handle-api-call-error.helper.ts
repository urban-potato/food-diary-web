import { NavigateFunction } from "react-router-dom";
import { logout } from "../../modules/UserInfoTile";
import { removeTokenFromLocalStorage } from "./local-storage.helper";
import { notify } from "./notify.helper";
import { ThunkDispatch } from "@reduxjs/toolkit";

type TProps = {
  error: any;
  dispatch: ThunkDispatch<any, any, any>;
  navigate: NavigateFunction;
};

// handles errors: 401, 403, FETCH_ERROR
// if 401 (because token expired), logs out locally
export function handleApiCallError({
  error,
  dispatch,
  navigate,
}: TProps): void {
  let errorMessage = "Произошла неизвестная ошибка :(";

  if (error?.status == 401) {
    errorMessage = "Требуется авторизация";

    dispatch(logout());
    removeTokenFromLocalStorage();
    navigate("/login");

    notify({
      messageText: errorMessage,
      toastId: "errorNotification",
      toastType: "error",
    });
  } else {
    if (error?.status == 403) {
      errorMessage = "Отсутстуют права для выполнения операции";
    } else if (error?.status == "FETCH_ERROR") {
      errorMessage = "Проблемы с интернет соединением";
    }

    notify({
      messageText: errorMessage,
      toastId: "errorNotification",
      toastType: "error",
    });
  }
}
