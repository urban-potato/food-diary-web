import {
  BASIC_CHARACTERISTICS_IDS_LIST,
  CALORIES_DEFAULT_ID,
  CARBOHYDRATE_DEFAULT_ID,
  FAT_DEFAULT_ID,
  PROTEIN_DEFAULT_ID,
} from "../constants/constants";
import {
  ICharacteristicsSum,
  ICharacteristicsSumWithLocalId,
  IFoodCharacteristic,
  IFoodCharacteristicType,
  IFoodCharacteristicTypeWithLocalId,
  IFoodCharacteristicWithLocalId,
} from "../types/entities-types";

type TCompareDefaultElement = {
  localId: number;
  [key: string]: any;
};

function compareDefault(a: TCompareDefaultElement, b: TCompareDefaultElement) {
  if (a.localId < b.localId) {
    return -1;
  }
  if (a.localId > b.localId) {
    return 1;
  }
  return 0;
}

type TCompareAdditionalElement = {
  localName: string;
  [key: string]: any;
};

function compareAdditional(
  a: TCompareAdditionalElement,
  b: TCompareAdditionalElement
) {
  if (a.localName < b.localName) {
    return -1;
  }
  if (a.localName > b.localName) {
    return 1;
  }
  return 0;
}

export const sortCharacteristics = (
  originalCharacteristicsList:
    | ICharacteristicsSum[]
    | IFoodCharacteristicType[]
    | IFoodCharacteristic[]
) => {
  let parsedCharacteristics = JSON.parse(
    JSON.stringify(originalCharacteristicsList)
  );

  const defaultCharacteristics = parsedCharacteristics.map(
    (
      characteristic:
        | ICharacteristicsSumWithLocalId
        | IFoodCharacteristicTypeWithLocalId
        | IFoodCharacteristicWithLocalId
    ) => {
      let characteristicId = null;

      if ("foodCharacteristicType" in characteristic) {
        characteristicId = characteristic.foodCharacteristicType.id;
      } else if ("characteristicTypeId" in characteristic) {
        characteristicId = characteristic.characteristicTypeId;
      } else {
        characteristicId = characteristic.id;
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
        return;
      }

      return characteristic;
    }
  );

  const additionalCharacteristics = parsedCharacteristics.map(
    (
      characteristic:
        | ICharacteristicsSumWithLocalId
        | IFoodCharacteristicTypeWithLocalId
        | IFoodCharacteristicWithLocalId
    ) => {
      let characteristicId = null;
      let characteristicName = null;

      if ("foodCharacteristicType" in characteristic) {
        characteristicId = characteristic.foodCharacteristicType.id;
        characteristicName = characteristic.foodCharacteristicType.name;
      } else if ("characteristicTypeId" in characteristic) {
        characteristicId = characteristic.characteristicTypeId;
        characteristicName = characteristic.characteristicName;
      } else {
        characteristicId = characteristic.id;
        characteristicName = characteristic.name;
      }

      if (BASIC_CHARACTERISTICS_IDS_LIST.includes(characteristicId as string)) {
        return;
      } else {
        characteristic.localName = characteristicName;
      }

      return characteristic;
    }
  );

  const filteredDefaultCharacteristics = defaultCharacteristics.filter(
    (item: any) => !!item
  );
  const filteredAdditionalCharacteristics = additionalCharacteristics.filter(
    (item: any) => !!item
  );

  filteredDefaultCharacteristics.sort(compareDefault);
  filteredAdditionalCharacteristics.sort(compareAdditional);

  const resultSortedCharacteristics = filteredDefaultCharacteristics.concat(
    filteredAdditionalCharacteristics
  );

  return resultSortedCharacteristics;
};
