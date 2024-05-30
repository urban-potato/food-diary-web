import { FC } from "react";
import {
  ICharacteristicsSum,
  IFoodCharacteristic,
  IFoodCharacteristicType,
} from "../../global/types/entities-types";
import { sortCharacteristics } from "../../global/helpers/sort-characteristics.helper";
import CharacteristicTile from "./CharacteristicTile";

type TProps = {
  characteristicsList:
    | ICharacteristicsSum[]
    | IFoodCharacteristic[]
    | IFoodCharacteristicType[];
};

const CharacteristicTilesList: FC<TProps> = ({
  characteristicsList: characteristicsSum,
}) => {
  const sortedConsumedCharacteristics = sortCharacteristics(characteristicsSum);

  const mappedCharacteristicsSum = sortedConsumedCharacteristics.map(
    (
      characteristic:
        | ICharacteristicsSum
        | IFoodCharacteristic
        | IFoodCharacteristicType
    ) => {
      let id = null;
      let name = null;
      let value = null;

      if ("foodCharacteristicType" in characteristic) {
        id = characteristic.foodCharacteristicType.id;
        name = characteristic.foodCharacteristicType.name;
        value = characteristic.characteristicSumValue;
      } else if ("characteristicTypeId" in characteristic) {
        id = characteristic.characteristicTypeId;
        name = characteristic.characteristicName;
        value = characteristic.value;
      } else {
        id = characteristic.id;
        name = characteristic.name;
        value = 0;
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
