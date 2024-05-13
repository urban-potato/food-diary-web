import { FC } from "react";
import { IFoodCharacteristicType } from "../../../../global/types/types";
import FoodCharacteristicTypeTile from "./FoodCharacteristicTypeTile";

type TProps = {
  foodCharacteristicTypes: IFoodCharacteristicType[];
};

const FoodCharacteristicTypesList: FC<TProps> = ({
  foodCharacteristicTypes,
}) => {
  const mappedFoodCharacteristicTypes = foodCharacteristicTypes.map(
    (characteristic: IFoodCharacteristicType) => {
      if (characteristic.name.toLowerCase() != "калории") {
        return (
          <FoodCharacteristicTypeTile
            key={`mappedFoodCharacteristicTypes_${characteristic.id}`}
            name={characteristic.name}
          />
        );
      }
    }
  );

  return <>{mappedFoodCharacteristicTypes}</>;
};

export default FoodCharacteristicTypesList;
