import { FC, useEffect, useRef } from "react";
import UserProfileInfoTile from "./UserProfileInfo/UserProfileInfoTile.tsx";
import { Player } from "@lordicon/react";
import { useGetUserInfo } from "../hooks/hooks.ts";
import PRELOADER from "../../../global/assets/system-regular-18-autorenew.json";
import FoodCharacteristicTypeInfoTile from "./FoodCharacteristicTypesInfo/FoodCharacteristicTypeInfoTile.tsx";
import { useGetAllFoodCharacteristicTypesQuery } from "../api/foodCharacteristicType.api.ts";

const UserProfile: FC = () => {
  let userInfo = useGetUserInfo();

  const {
    isLoading: isLoadingFoodCharacteristicTypes,
    data: dataFoodCharacteristicTypes,
  } = useGetAllFoodCharacteristicTypesQuery(undefined);

  const preloaderPlayerRef = useRef<Player>(null);

  useEffect(() => {
    preloaderPlayerRef.current?.playFromBeginning();
  }, [userInfo]);

  return (
    <section className="flex flex-col justify-center items-center w-full gap-5">
      {!userInfo ||
      !userInfo?.email ||
      !dataFoodCharacteristicTypes ||
      dataFoodCharacteristicTypes?.items?.length < 1 ? (
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
        <>
          <UserProfileInfoTile userInfo={userInfo!} />

          <FoodCharacteristicTypeInfoTile
            foodCharacteristicTypes={
              dataFoodCharacteristicTypes?.items?.length > 0
                ? dataFoodCharacteristicTypes?.items
                : []
            }
          />
        </>
      )}
    </section>
  );
};

export default UserProfile;
