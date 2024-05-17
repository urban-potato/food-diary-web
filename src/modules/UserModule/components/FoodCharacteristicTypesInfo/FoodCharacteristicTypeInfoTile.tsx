import { FC, useRef, useState } from "react";
import FoodCharacteristicTypeInfoEditForm from "./FoodCharacteristicTypeInfoEditForm";
import FoodCharacteristicTypeInfoTileBody from "./FoodCharacteristicTypeInfoTileBody";
import { IFoodCharacteristicType } from "../../../../global/types/types";
import { sortConsumedCharacteristics } from "../../../../global/helpers/sort_characteristics.helper";
import { Player } from "@lordicon/react";
import EDIT_ICON from "../../../../global/assets/system-regular-63-settings-cog.json";

type TProps = {
  foodCharacteristicTypes: IFoodCharacteristicType[];
};

const FoodCharacteristicTypeInfoTile: FC<TProps> = ({
  foodCharacteristicTypes,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const editIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  const sortedFoodCharacteristicTypes: IFoodCharacteristicType[] =
    sortConsumedCharacteristics(foodCharacteristicTypes);

  sortedFoodCharacteristicTypes.splice(3, 1);

  // console.log("sortedFoodCharacteristicTypes", sortedFoodCharacteristicTypes);

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
          <FoodCharacteristicTypeInfoEditForm
            originalFoodCharacteristicTypes={sortedFoodCharacteristicTypes}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
          />
        ) : (
          <FoodCharacteristicTypeInfoTileBody
            foodCharacteristicTypes={sortedFoodCharacteristicTypes}
          />
        )}
      </div>
    </div>
  );
};

export default FoodCharacteristicTypeInfoTile;
