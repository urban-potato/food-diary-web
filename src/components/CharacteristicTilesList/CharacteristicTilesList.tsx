import { FC } from "react";
import {
  ICharacteristicsSum,
  IFoodCharacteristic,
} from "../../global/types/types";
import { sortConsumedCharacteristics } from "../../global/helpers/sort_characteristics.helper";
import CharacteristicTile from "./CharacteristicTile";
import { ZERO_CHARACTERISTICS_SUM_DATA } from "../../global/constants/constants";

type TProps = {
  characteristicsList: ICharacteristicsSum[] | IFoodCharacteristic[];
};

const CharacteristicTilesList: FC<TProps> = ({
  characteristicsList: characteristicsSum,
}) => {
  const characteristicsSumList =
    characteristicsSum.length == 0
      ? ZERO_CHARACTERISTICS_SUM_DATA
      : characteristicsSum;

  const sortedConsumedCharacteristics = sortConsumedCharacteristics(
    characteristicsSumList
  );

  const mappedCharacteristicsSum = sortedConsumedCharacteristics.map(
    (characteristic: ICharacteristicsSum | IFoodCharacteristic) => {
      let id = null;
      let name = null;
      let value = null;

      if ("foodCharacteristicType" in characteristic) {
        id = characteristic.foodCharacteristicType.id;
        name = characteristic.foodCharacteristicType.name;
        value = characteristic.characteristicSumValue;
      } else {
        id = characteristic.characteristicTypeId;
        name = characteristic.characteristicName;
        value = characteristic.value;
      }

      return (
        <CharacteristicTile
          key={`mappedCharacteristicsSum_${id}`}
          name={name}
          value={value}
        />
      );
    }
  );

  return <>{mappedCharacteristicsSum}</>;
};

export default CharacteristicTilesList;
