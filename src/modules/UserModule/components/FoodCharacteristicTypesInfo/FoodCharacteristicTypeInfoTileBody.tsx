import { FC, useRef } from "react";
import { IFoodCharacteristicType } from "../../../../global/types/types";
import { Player } from "@lordicon/react";
import EDIT_ICON from "../../../../global/assets/system-regular-63-settings-cog.json";
import FoodCharacteristicTypesList from "./FoodCharacteristicTypesList";

type TProps = {
  foodCharacteristicTypes: IFoodCharacteristicType[];
  isEditMode: boolean;
  setIsEditMode: Function;
};

const FoodCharacteristicTypeInfoTileBody: FC<TProps> = ({
  foodCharacteristicTypes,
  isEditMode,
  setIsEditMode,
}) => {
  const editIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  return (
    <div className="flex flex-col w-full gap-y-4">
      <div className="w-full text-xl font-bold flex justify-center items-center -mt-11 mb-3">
        <p className="truncate">Нутриенты</p>
      </div>

      <div className="flex flex-wrap w-full gap-4">
        <FoodCharacteristicTypesList
          foodCharacteristicTypes={foodCharacteristicTypes}
        />
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
    </div>
  );
};

export default FoodCharacteristicTypeInfoTileBody;
