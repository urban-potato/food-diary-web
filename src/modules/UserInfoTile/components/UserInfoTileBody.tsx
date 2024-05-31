import { FC } from "react";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated.tsx";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../global/store/store-hooks.ts";
import { logout } from "../slices/user-slice.ts";
import { removeTokenFromLocalStorage } from "../../../global/helpers/local-storage.helper.ts";
import { IUser } from "../../../global/types/entities-types.ts";

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
  };

  return (
    <div className="flex flex-col w-full gap-y-4">
      <div className="-mt-4 flex flex-wrap items-center gap-x-2">
        <p className="text-ellipsis overflow-hidden font-bold text-lg">
          Почта:{" "}
        </p>
        <p className="text-ellipsis overflow-hidden">{userInfo.email}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-2">
        <p className="text-ellipsis overflow-hidden font-bold text-lg">Имя: </p>
        {userInfo.firstName ? (
          <p className="text-ellipsis overflow-hidden">{userInfo.firstName}</p>
        ) : (
          <p className="text-rose-700 font-bold">не указано</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-2 ">
        <p className="text-ellipsis overflow-hidden font-bold text-lg">
          Фамилия:{" "}
        </p>

        {userInfo.lastName ? (
          <p className="text-ellipsis overflow-hidden">{userInfo.lastName}</p>
        ) : (
          <p className="text-rose-700 font-bold">не указано</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap w-full gap-x-4 gap-y-1 justify-stretch items-center">
        <span className="flex-grow">
          <ButtonIlluminated
            children={"Выйти"}
            type="button"
            onClick={(): void => handleExitAccount()}
            buttonVariant={"dark"}
          />
        </span>
      </div>
    </div>
  );
};

export default UserInfoTileBody;
