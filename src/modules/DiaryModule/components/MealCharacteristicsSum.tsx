import { ICharacteristicsSum } from "../../../global/types/types";
import { sortConsumedCharacteristics } from "../helpers/helpers";
import ConsumedCharacteristicTile from "./ConsumedCharacteristicTile";

import { FC } from "react";

type TProps = {
  characteristicsSum: ICharacteristicsSum[];
};

const MealCharacteristicsSum: FC<TProps> = ({ characteristicsSum }) => {
  const sortedConsumedCharacteristics =
    sortConsumedCharacteristics(characteristicsSum);

  const mappedCharacteristicsSum = sortedConsumedCharacteristics.map(
    (characteristic: ICharacteristicsSum) => {
      return (
        <ConsumedCharacteristicTile
          key={`mappedCharacteristicsSum_${characteristic.foodCharacteristicType.id}`}
          name={characteristic.foodCharacteristicType.name}
          value={characteristic.characteristicSumValue}
        />
      );
    }
  );

  return <div className="flex flex-wrap gap-3">{mappedCharacteristicsSum}</div>;
};

export default MealCharacteristicsSum;
