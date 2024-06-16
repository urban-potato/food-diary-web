import { FC } from "react";
import { IFoodCharacteristicType } from "../../../global/types/entities-types";
import FoodCharacteristicTypesList from "./FoodCharacteristicTypesList";

type TProps = {
  foodCharacteristicTypes: IFoodCharacteristicType[];
};

const FoodCharacteristicTypesInfoTileBody: FC<TProps> = ({
  foodCharacteristicTypes,
}) => {
  return (
    <div className="flex flex-col w-full gap-y-4">
      <div className="w-full text-xl font-bold flex justify-center items-center mb-3">
        <p className="break-words max-w-full">Управление нутриентами</p>
      </div>

      <div className="flex flex-wrap w-full gap-4">
        <FoodCharacteristicTypesList
          foodCharacteristicTypes={foodCharacteristicTypes}
        />
      </div>
    </div>
  );
};

export default FoodCharacteristicTypesInfoTileBody;
