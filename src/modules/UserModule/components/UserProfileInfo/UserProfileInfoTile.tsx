import { FC, useRef, useState } from "react";
import UserProfileInfoEditForm from "./UserProfileInfoEditForm.tsx";
import UserProfileInfoTileBody from "./UserProfileInfoTileBody.tsx";
import { IUser } from "../../types/types.ts";
import { Player } from "@lordicon/react";
import EDIT_ICON from "../../../../global/assets/system-regular-63-settings-cog.json";

type TProps = {
  userInfo: IUser;
};

const UserProfileInfoTile: FC<TProps> = ({ userInfo }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const editIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  return (
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
          <UserProfileInfoEditForm
            id={userInfo?.id}
            email={userInfo?.email}
            firstName={userInfo?.firstName ? userInfo?.firstName : ""}
            lastName={userInfo?.lastName ? userInfo?.lastName : ""}
            setIsEditMode={setIsEditMode}
          />
        ) : (
          <UserProfileInfoTileBody userInfo={userInfo} />
        )}
      </div>
    </div>
  );
};

export default UserProfileInfoTile;
