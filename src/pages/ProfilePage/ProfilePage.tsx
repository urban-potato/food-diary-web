import { FC } from "react";
import { FoodCharacteristicTypesInfoTile } from "../../modules/FoodCharacteristicTypesInfoTile";
import { UserInfoTile } from "../../modules/UserInfoTile";

const ProfilePage: FC = () => {
  return (
    <section className="flex flex-col justify-center items-center w-full gap-5">
      <UserInfoTile />
      <FoodCharacteristicTypesInfoTile />
    </section>
  );
};

export default ProfilePage;
