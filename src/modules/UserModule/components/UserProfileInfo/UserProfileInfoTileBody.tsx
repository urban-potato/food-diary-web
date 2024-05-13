import { FC, useRef } from "react";
import ButtonIlluminated from "../../../../ui/ButtonIlluminated/ButtonIlluminated.tsx";
import { Player } from "@lordicon/react";
import EDIT_ICON from "../../../../global/assets/system-regular-63-settings-cog.json";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../global/store/hooks.ts";
import { logout } from "../../slices/userSlice.ts";
import { removeTokenFromLocalStorage } from "../../../../global/helpers/local_storage.helper.ts";
import { IUser } from "../../types/types.ts";

type TProps = {
  userInfo: IUser;
  isEditMode: boolean;
  setIsEditMode: Function;
};

const UserProfileInfoTileBody: FC<TProps> = ({
  userInfo,
  isEditMode,
  setIsEditMode,
}) => {
  const editIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

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

      <div className="order-[-1] ml-auto gap-x-2 flex justify-center items-start">
        <span role="button" onClick={() => setIsEditMode(!isEditMode)}>
          <span
            onMouseEnter={() => editIconPlayerRef.current?.playFromBeginning()}
          >
            <Player
              ref={editIconPlayerRef}
              icon={EDIT_ICON}
              size={ICON_SIZE}
              colorize="#0d0b26"
            />
          </span>
        </span>
      </div>

      <div className="mt-4 flex flex-wrap w-full gap-x-4 gap-y-1 justify-stretch items-center">
        <span className="flex-grow">
          <ButtonIlluminated
            label="Выйти"
            isDarkButton={true}
            isIlluminationFull={false}
            onClick={(): void => handleExitAccount()}
            buttonPadding=" p-4 "
            // additionalStyles=" min-w-[0px] "
          />
        </span>
      </div>
    </div>
  );
};

export default UserProfileInfoTileBody;
