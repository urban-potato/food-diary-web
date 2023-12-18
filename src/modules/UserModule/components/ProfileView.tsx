import { useEffect, useState } from "react";
import { useGetUserInfoQuery, useLazyGetUserInfoQuery } from "../api/user.api";
import ProfileEdit from "./ProfileEdit";
import { Player } from "@lordicon/react";
import EDIT_ICON from "../../../global/assets/system-regular-63-settings-cog.json";
import { useRef } from "react";
import { useGetMeQuery } from "../../AuthorizationModule/api/auth.api";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../global/store/hooks";
import { logout } from "../slices/userSlice";
import { removeTokenFromLocalStorage } from "../../../global/helpers/local_storage.helper";
import { toast } from "react-hot-toast";
import IlluminatedButton from "../../../ui/IlluminatedButton.tsx";

import PRELOADER from "../../../global/assets/system-regular-18-autorenew.json";

const ProfileView = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleExitAccount = () => {
    dispatch(logout());
    removeTokenFromLocalStorage();
    toast.success("Вы вышли из аккаунта");
    navigate("/");
  };

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

  const [isEditMode, setIsEditMode] = useState(false);
  const editIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  //   console.log("dataGetUserInfo");
  //   console.log(dataGetUserInfo);

  const preloaderPlayerRef = useRef<Player>(null);

  useEffect(() => {
    preloaderPlayerRef.current?.playFromBeginning();
  });

  return (
    <div className="flex justify-center items-center w-full 
    ">
      {isLoadingGetMeQuery || isLoadingGetUserInfo ? (
        <span className="m-10">
          <Player
            ref={preloaderPlayerRef}
            icon={PRELOADER}
            size={100}
            colorize="#0d0b26"
            onComplete={() => preloaderPlayerRef.current?.playFromBeginning()}
          />
        </span>
      ) : (
        <div
          className="group/profile relative 

    w-full max-w-5xl 
   
  
    "
        >
          <div
            className="absolute inset-0 
      
      rounded-xl 

      bg-gradient-to-r from-pink-500 to-violet-500 
      opacity-25 

      transition duration-1000 

      group-hover/profile:opacity-40 
      group-hover/profile:duration-500 
      group-hover/profile:scale-101

      group-focus-within/profile:opacity-40 
      group-focus-within/profile:duration-500 
      group-focus-within/profile:scale-101
      
      "
          ></div>
          <div
            className="relative flex flex-wrap w-full 
      justify-center items-start 
      
      px-7  pt-5 pb-6
     
      transition duration-1000 

      group-hover/profile:duration-500 
      group-hover/profile:scale-101

      group-focus-within/profile:duration-500 
      group-focus-within/profile:scale-101 
      "
          >
            {isEditMode ? (
              <ProfileEdit
                id={dataGetUserInfo?.id}
                email={dataGetUserInfo?.email}
                firstName={dataGetUserInfo?.firstName}
                lastName={dataGetUserInfo?.lastName}
                setIsEditMode={setIsEditMode}
              />
            ) : (
              <div
                className="flex flex-col w-full gap-y-4  
    
          "
              >
                <div className="-mt-4 flex flex-wrap items-center gap-x-2 ">
                  <p className="text-ellipsis overflow-hidden font-bold text-lg">Почта: </p>
                  <p className="text-ellipsis overflow-hidden">{dataGetUserInfo?.email}</p>
                </div>

                <div className="flex flex-wrap items-center gap-x-2">
                  <p className="text-ellipsis overflow-hidden font-bold text-lg">Имя: </p>
                  <p className="text-ellipsis overflow-hidden">
                    {dataGetUserInfo?.firstName
                      ? dataGetUserInfo?.firstName
                      : <p className="text-rose-700 font-bold">не указано</p>}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 ">
                  <p className="text-ellipsis overflow-hidden font-bold text-lg">Фамилия: </p>
                  <p className="text-ellipsis overflow-hidden">
                    {dataGetUserInfo?.lastName
                      ? dataGetUserInfo?.lastName
                      : <p className="text-rose-700 font-bold">не указано</p>}
                  </p>
                </div>

                <div className="order-[-1] ml-auto gap-x-2 flex justify-center items-start ">
                  <span
                    role="button"
                    onClick={() => setIsEditMode(!isEditMode)}
                  >
                    <span
                      onMouseEnter={() =>
                        editIconPlayerRef.current?.playFromBeginning()
                      }
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
                {/* <button
              className="btn btn_dark"
              onClick={(): void => handleExitAccount()}
            >
              Выйти
            </button> */}

                <div
                  className=" mt-4 
          flex flex-wrap w-full 
          gap-x-4 gap-y-1 
          justify-stretch items-center"
                >
                  <span className="flex-grow">
                    <IlluminatedButton
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
