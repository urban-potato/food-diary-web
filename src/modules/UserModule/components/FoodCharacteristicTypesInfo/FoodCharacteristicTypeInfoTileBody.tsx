import { FC } from "react";
import { IFoodCharacteristicType } from "../../../../global/types/types";
import FoodCharacteristicTypesList from "./FoodCharacteristicTypesList";

type TProps = {
  foodCharacteristicTypes: IFoodCharacteristicType[];
};

const FoodCharacteristicTypeInfoTileBody: FC<TProps> = ({
  foodCharacteristicTypes,
}) => {
  return (
    <div className="flex flex-col w-full gap-y-4">
      <div className="w-full text-xl font-bold flex justify-center items-center -mt-5 mb-3">
        <p className="truncate">Нутриенты</p>
      </div>

      <div className="flex flex-wrap w-full gap-4">
        <FoodCharacteristicTypesList
          foodCharacteristicTypes={foodCharacteristicTypes}
        />
      </div>
    </div>
  );
};

export default FoodCharacteristicTypeInfoTileBody;
