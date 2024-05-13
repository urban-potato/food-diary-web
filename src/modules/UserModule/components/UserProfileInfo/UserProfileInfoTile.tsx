import { FC, useState } from "react";
import UserProfileInfoEditForm from "./UserProfileInfoEditForm.tsx";
import UserProfileInfoTileBody from "./UserProfileInfoTileBody.tsx";
import { IUser } from "../../types/types.ts";

type TProps = {
  userInfo: IUser;
};

const UserProfileInfoTile: FC<TProps> = ({ userInfo }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="outer_box_style group w-full max-w-5xl">
      <div className="box_style"></div>
      <div className="box_content_transition flex flex-wrap w-full justify-center items-start px-7 pt-5 pb-6">
        {isEditMode ? (
          <UserProfileInfoEditForm
            id={userInfo?.id}
            email={userInfo?.email}
            firstName={userInfo?.firstName ? userInfo?.firstName : ""}
            lastName={userInfo?.lastName ? userInfo?.lastName : ""}
            setIsEditMode={setIsEditMode}
          />
        ) : (
          <UserProfileInfoTileBody
            userInfo={userInfo}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfileInfoTile;
