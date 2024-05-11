import {
  CALORIES_DEFAULT_ID,
  CARBOHYDRATE_DEFAULT_ID,
  FAT_DEFAULT_ID,
  PROTEIN_DEFAULT_ID,
} from "../constants/constants";
import {
  ICharacteristicsSum,
  ICharacteristicsSumWithLocalId,
} from "../types/types";

export const sortConsumedCharacteristics = (
  characteristicsSum: ICharacteristicsSum[]
) => {
  let parsedCharacteristics = JSON.parse(JSON.stringify(characteristicsSum));

  let preparedCharacteristics = parsedCharacteristics.map(
    (characteristic: ICharacteristicsSumWithLocalId) => {
      let localId = 4;

      if (
        characteristic.foodCharacteristicType.id.toLowerCase() ===
        PROTEIN_DEFAULT_ID
      ) {
        characteristic.localId = 0;
      } else if (
        characteristic.foodCharacteristicType.id.toLowerCase() ===
        FAT_DEFAULT_ID
      ) {
        characteristic.localId = 1;
      } else if (
        characteristic.foodCharacteristicType.id.toLowerCase() ===
        CARBOHYDRATE_DEFAULT_ID
      ) {
        characteristic.localId = 2;
      } else if (
        characteristic.foodCharacteristicType.id.toLowerCase() ===
        CALORIES_DEFAULT_ID
      ) {
        characteristic.localId = 3;
      } else {
        characteristic.localId = localId;
        localId++;
      }

      return characteristic;
    }
  );

  function compare(
    a: ICharacteristicsSumWithLocalId,
    b: ICharacteristicsSumWithLocalId
  ) {
    if (a.localId < b.localId) {
      return -1;
    }
    if (a.localId > b.localId) {
      return 1;
    }
    return 0;
  }

  preparedCharacteristics.sort(compare);

  return preparedCharacteristics;
};
