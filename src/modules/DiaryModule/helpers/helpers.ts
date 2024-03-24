import {
  CALORIES_DEFAULT_ID,
  CARBOHYDRATE_DEFAULT_ID,
  FAT_DEFAULT_ID,
  PROTEIN_DEFAULT_ID,
} from "../../../global/constants/constants";
import {
  IConsumedCharacteristic,
  IConsumedCharacteristicWithLocalId,
} from "../types/types";

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
  consumedCharacteristics: IConsumedCharacteristic[]
) => {
  let parsedCharacteristics = JSON.parse(
    JSON.stringify(consumedCharacteristics)
  );

  let preparedCharacteristics = parsedCharacteristics.map(
    (c: IConsumedCharacteristicWithLocalId) => {
      let localId = 4;

      if (c.foodCharacteristicType.id.toLowerCase() === PROTEIN_DEFAULT_ID) {
        c.localId = 0;
      } else if (c.foodCharacteristicType.id.toLowerCase() === FAT_DEFAULT_ID) {
        c.localId = 1;
      } else if (
        c.foodCharacteristicType.id.toLowerCase() === CARBOHYDRATE_DEFAULT_ID
      ) {
        c.localId = 2;
      } else if (
        c.foodCharacteristicType.id.toLowerCase() === CALORIES_DEFAULT_ID
      ) {
        c.localId = 3;
      } else {
        c.localId = localId;
        localId++;
      }

      return c;
    }
  );

  function compare(
    a: IConsumedCharacteristicWithLocalId,
    b: IConsumedCharacteristicWithLocalId
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
