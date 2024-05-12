import { FC } from "react";
import { ICharacteristicsSum } from "../../global/types/types";
import { sortConsumedCharacteristics } from "../../global/helpers/sort_characteristics.helper";
import CharacteristicTile from "./CharacteristicTile";
import { ZERO_CHARACTERISTICS_SUM_DATA } from "../../global/constants/constants";

type TProps = {
  characteristicsSum: ICharacteristicsSum[];
};

const CharacteristicsSumList: FC<TProps> = ({ characteristicsSum }) => {
  const characteristicsSumList =
    characteristicsSum.length == 0
      ? ZERO_CHARACTERISTICS_SUM_DATA
      : characteristicsSum;

  const sortedConsumedCharacteristics = sortConsumedCharacteristics(
    characteristicsSumList
  );

  const mappedCharacteristicsSum = sortedConsumedCharacteristics.map(
    (characteristic: ICharacteristicsSum) => {
      return (
        <CharacteristicTile
          key={`mappedCharacteristicsSum_${characteristic.foodCharacteristicType.id}`}
          name={characteristic.foodCharacteristicType.name}
          value={characteristic.characteristicSumValue}
        />
      );
    }
  );

  return <>{mappedCharacteristicsSum}</>;

  // return (
  //   <div className="flex flex-wrap gap-3 w-full">
  //     {mappedCharacteristicsSum}
  //   </div>
  // );
};

export default CharacteristicsSumList;
