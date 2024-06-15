import { FC } from "react";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated.tsx";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../global/store/store-hooks.ts";
import { logout } from "../slices/user-slice.ts";
import { removeTokenFromLocalStorage } from "../../../global/helpers/local-storage.helper.ts";
import { IUser } from "../../../global/types/entities-types.ts";
import { notify } from "../../../global/helpers/notify.helper.tsx";

type TProps = {
  userInfo: IUser;
};

const UserInfoTileBody: FC<TProps> = ({ userInfo }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleExitAccount = () => {
    dispatch(logout());
    removeTokenFromLocalStorage();
    navigate("/");

    notify({
      messageText: "Вы вышли из системы",
      toastId: "infoLogoutNotification",
      toastType: "info",
    });
  };

  return (
    <div className="flex flex-col w-full gap-y-4 ">
      <div className="flex flex-wrap items-center gap-x-2 overflow-hidden">
        <p className="break-all font-bold text-lg">
          Почта:{" "}
        </p>
        <p className="break-all">{userInfo.email}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 overflow-hidden">
        <p className="break-all font-bold text-lg">Имя: </p>
        {userInfo.firstName ? (
          <p className="break-all">{userInfo.firstName}</p>
        ) : (
          <p className="text-rose-700 font-bold break-all">не указано</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-2 overflow-hidden">
        <p className="break-all font-bold text-lg">
          Фамилия:{" "}
        </p>

        {userInfo.lastName ? (
          <p className="break-all">{userInfo.lastName}</p>
        ) : (
          <p className="text-rose-700 font-bold">не указано</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap w-full gap-x-4 gap-y-1 justify-stretch items-center">
        <span className="flex-grow">
          <ButtonIlluminated
            children={"Выйти"}
            type="button"
            onClick={() => handleExitAccount()}
            buttonVariant={"dark"}
          />
        </span>
      </div>
    </div>
  );
};

export default UserInfoTileBody;
