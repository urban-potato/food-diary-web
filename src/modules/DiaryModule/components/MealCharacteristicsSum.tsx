import { sortConsumedCharacteristics } from "../helpers/helpers";
import ConsumedCharacteristicTile from "./ConsumedCharacteristicTile";
import type { IConsumedCharacteristic } from "../types/types";
import { FC } from "react";

type TProps = {
  characteristicsSum: IConsumedCharacteristic[];
};

const MealCharacteristicsSum: FC<TProps> = ({ characteristicsSum }) => {
  const sortedConsumedCharacteristics =
    sortConsumedCharacteristics(characteristicsSum);

  const mappedCharacteristicsSum = sortedConsumedCharacteristics.map(
    (characteristic: IConsumedCharacteristic) => {
      return (
        <ConsumedCharacteristicTile
          key={`mappedCharacteristicsSum_${characteristic.foodCharacteristicType.id}`}
          name={characteristic.foodCharacteristicType.name}
          value={characteristic.characteristicSumValue}
        />
      );
    }
  );

  return (
    <div className="mt-5 flex flex-wrap gap-x-2 gap-y-3">
      {mappedCharacteristicsSum}
    </div>
  );
};

export default MealCharacteristicsSum;
