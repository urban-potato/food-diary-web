import { IFoodCharacteristicProps } from "../types/types";

const FoodCharacteristic = ({
  name,
  characteristicTypeId,
  value,
}: IFoodCharacteristicProps) => {
  return (
    <div>
      {name}: {value}
    </div>
  );
};

export default FoodCharacteristic;
