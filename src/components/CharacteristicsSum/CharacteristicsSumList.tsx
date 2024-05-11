import { FC } from "react";
import { ICharacteristicsSum } from "../../global/types/types";
import { sortConsumedCharacteristics } from "../../global/helpers/sort_characteristics.helper";
import CharacteristicTile from "./CharacteristicTile";

type TProps = {
  characteristicsSum: ICharacteristicsSum[];
};

const CharacteristicsSumList: FC<TProps> = ({ characteristicsSum }) => {
  const sortedConsumedCharacteristics =
    sortConsumedCharacteristics(characteristicsSum);

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

  return <div className="flex flex-wrap gap-3">{mappedCharacteristicsSum}</div>;
};

export default CharacteristicsSumList;
