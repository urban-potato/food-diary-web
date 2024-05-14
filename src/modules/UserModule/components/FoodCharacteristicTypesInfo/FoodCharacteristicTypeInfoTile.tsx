import { FC, useState } from "react";
import FoodCharacteristicTypeInfoEditForm from "./FoodCharacteristicTypeInfoEditForm";
import FoodCharacteristicTypeInfoTileBody from "./FoodCharacteristicTypeInfoTileBody";
import { IFoodCharacteristicType } from "../../../../global/types/types";
import { sortConsumedCharacteristics } from "../../../../global/helpers/sort_characteristics.helper";

type TProps = {
  foodCharacteristicTypes: IFoodCharacteristicType[];
};

const FoodCharacteristicTypeInfoTile: FC<TProps> = ({
  foodCharacteristicTypes,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const sortedFoodCharacteristicTypes: IFoodCharacteristicType[] =
    sortConsumedCharacteristics(foodCharacteristicTypes);

  sortedFoodCharacteristicTypes.splice(3, 1);

  // console.log("sortedFoodCharacteristicTypes", sortedFoodCharacteristicTypes);

  return (
    <div className="outer_box_style group w-full max-w-5xl">
      <div className="box_style"></div>
      <div className="box_content_transition flex flex-wrap w-full justify-center items-start px-7 py-7 gap-4">
        {isEditMode ? (
          <FoodCharacteristicTypeInfoEditForm
            originalFoodCharacteristicTypes={sortedFoodCharacteristicTypes}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
          />
        ) : (
          <FoodCharacteristicTypeInfoTileBody
            foodCharacteristicTypes={sortedFoodCharacteristicTypes}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
          />
        )}
      </div>
    </div>
  );
};

export default FoodCharacteristicTypeInfoTile;
