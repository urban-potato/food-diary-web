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

  return (
    <div className="outer_box_style group w-full max-w-5xl">
      <div className="box_style"></div>
      <div className="box_content_transition flex flex-wrap w-full justify-center items-start px-7 pt-5 pb-6">
        {isEditMode ? (
          <FoodCharacteristicTypeInfoEditForm
          // id={userInfo?.id}
          // email={userInfo?.email}
          // firstName={userInfo?.firstName ? userInfo?.firstName : ""}
          // lastName={userInfo?.lastName ? userInfo?.lastName : ""}
          // setIsEditMode={setIsEditMode}
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
