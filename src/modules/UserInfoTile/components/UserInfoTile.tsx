import { FC, useRef, useState } from "react";
import UserInfoEditForm from "./UserInfoEditForm.tsx";
import UserInfoTileBody from "./UserInfoTileBody.tsx";
import { Player } from "@lordicon/react";
import EDIT_ICON from "../../../global/assets/settings.json";
import { useGetUserInfo } from "../hooks/use-get-user-info.hook.ts";
import Preloader from "../../../components/Preloader/Preloader.tsx";

const UserInfoTile: FC = () => {
  let userInfo = useGetUserInfo();

  const [isEditMode, setIsEditMode] = useState(false);

  const editIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  return (
    <section className="flex flex-col justify-center items-center w-full gap-5">
      {!userInfo || !userInfo?.email ? (
        <span className="m-10">
          <Preloader />
        </span>
      ) : (
        <div className="outer_box_style group w-full max-w-5xl">
          <div className="box_style"></div>
          <div className="box_content_transition flex flex-wrap w-full justify-center items-start p-7">
            <div className="ml-auto gap-x-2 flex justify-center items-start">
              <span role="button" onClick={() => setIsEditMode(!isEditMode)}>
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
                id={userInfo?.id}
                originalEmail={userInfo?.email}
                originalFirstName={
                  userInfo?.firstName ? userInfo?.firstName : ""
                }
                originalLastName={userInfo?.lastName ? userInfo?.lastName : ""}
                setIsEditMode={setIsEditMode}
              />
            ) : (
              <UserInfoTileBody userInfo={userInfo} />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default UserInfoTile;
