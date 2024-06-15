import { FC, useRef, useState } from "react";
import UserInfoEditForm from "./UserInfoEditForm.tsx";
import UserInfoTileBody from "./UserInfoTileBody.tsx";
import { Player } from "@lordicon/react";
import EDIT_ICON from "../../../global/assets/settings.json";
import { useGetUserInfo } from "../hooks/use-get-user-info.hook.ts";
import Preloader from "../../../components/Preloader/Preloader.tsx";
import { useGetUserInfoQuery } from "../api/profile.api.ts";
import { notify } from "../../../global/helpers/notify.helper.tsx";
import LoaderWithBlock from "../../../components/LoaderWithBlock/LoaderWithBlock.tsx";

const UserInfoTile: FC = () => {
  const [mainlIsLoading, setMainIsLoading] = useState(false);

  let userInfo = useGetUserInfo();

  const {
    isLoading: isLoadingGetUserInfo,
    data: dataGetUserInfo,
    isError: isErrorGetUserInfo,
    error: errorGetUserInfo,
  } = useGetUserInfoQuery(userInfo?.id);

  if (isErrorGetUserInfo && errorGetUserInfo && "status" in errorGetUserInfo) {
    let errorMessage =
      "При получении данных пользователя произошла неизвестная ошибка :(";

    if (errorGetUserInfo?.status == "FETCH_ERROR") {
      errorMessage = "Проблемы с интернет соединением";
    }

    notify({
      messageText: errorMessage,
      toastId: "errorNotification",
      toastType: "error",
    });
  }

  const [isEditMode, setIsEditMode] = useState(false);

  const editIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  return (
    <section className="flex flex-col justify-center items-center w-full gap-5">
      {isLoadingGetUserInfo || !dataGetUserInfo?.email ? (
        <span className="m-10">
          <Preloader />
        </span>
      ) : (
        <div className="outer_box_style group w-full max-w-5xl">
          <div className="box_style"></div>

          {mainlIsLoading && <LoaderWithBlock className="loader_with_block" />}

          <div className="box_content_transition flex flex-wrap w-full justify-center items-start p-7">
            <div className="ml-auto gap-x-2 flex justify-center items-start">
              <span
                role="button"
                className="remove_tap_highlight"
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

            {isEditMode ? (
              <UserInfoEditForm
                id={dataGetUserInfo?.id}
                originalEmail={dataGetUserInfo?.email}
                originalFirstName={
                  dataGetUserInfo?.firstName ? dataGetUserInfo?.firstName : ""
                }
                originalLastName={
                  dataGetUserInfo?.lastName ? dataGetUserInfo?.lastName : ""
                }
                setIsEditMode={setIsEditMode}
                isEditMode={isEditMode}
                setMainIsLoading={setMainIsLoading}
              />
            ) : (
              <UserInfoTileBody userInfo={dataGetUserInfo} />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default UserInfoTile;
