import {
  CALORIES_DEFAULT_ID,
  CARBOHYDRATE_DEFAULT_ID,
  FAT_DEFAULT_ID,
  PROTEIN_DEFAULT_ID,
} from "../constants/constants";
import {
  ICharacteristicsSum,
  ICharacteristicsSumWithLocalId,
  IFoodCharacteristicType,
  IFoodCharacteristicTypeWithLocalId,
} from "../types/types";

export const sortConsumedCharacteristics = (
  characteristicsSum: ICharacteristicsSum[] | IFoodCharacteristicType[]
) => {
  let parsedCharacteristics = JSON.parse(JSON.stringify(characteristicsSum));
  let localId = 4;

  let preparedCharacteristics = parsedCharacteristics.map(
    (
      characteristic:
        | ICharacteristicsSumWithLocalId
        | IFoodCharacteristicTypeWithLocalId
    ) => {
      let characteristicId = null;

      if ("foodCharacteristicType" in characteristic) {
        characteristicId =
          characteristic.foodCharacteristicType.id.toLowerCase();
      } else {
        characteristicId = characteristic.id.toLowerCase();
      }

      if (characteristicId === PROTEIN_DEFAULT_ID) {
        characteristic.localId = 0;
      } else if (characteristicId === FAT_DEFAULT_ID) {
        characteristic.localId = 1;
      } else if (characteristicId === CARBOHYDRATE_DEFAULT_ID) {
        characteristic.localId = 2;
      } else if (characteristicId === CALORIES_DEFAULT_ID) {
        characteristic.localId = 3;
      } else {
        characteristic.localId = localId;
        localId += 1;
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
