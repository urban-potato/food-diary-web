import {
  CALORIES_DEFAULT_ID,
  CARBOHYDRATE_DEFAULT_ID,
  FAT_DEFAULT_ID,
  PROTEIN_DEFAULT_ID,
} from "../../../global/constants/constants";
import { ICharacteristicsSum } from "../../../global/types/types";
import { ICharacteristicsSumWithLocalId } from "../types/types";

export const formatNumber = (number: number) => {
  let numberStr = "";

  if (number < 10) {
    numberStr = "0" + number;
  } else {
    numberStr = number.toString();
  }

  return numberStr;
};

export const getFormattedDateTime = () => {
  const nowDate = new Date();

  let month = formatNumber(nowDate.getMonth() + 1);
  let day = formatNumber(nowDate.getDate());

  let hours = formatNumber(nowDate.getHours());
  let minutes = formatNumber(nowDate.getMinutes());
  let seconds = formatNumber(nowDate.getSeconds());

  const time = `${hours}:${minutes}:${seconds}`;
  const date = `${nowDate.getFullYear()}-${month}-${day}`;

  const result = [date, time];

  return result;
};

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
