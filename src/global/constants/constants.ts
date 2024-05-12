import { ICharacteristicsSum } from "../types/types";

export const PROTEIN_DEFAULT_ID = "0141a646-e0ce-4f7a-9433-97112f05db0f";
export const FAT_DEFAULT_ID = "d126d15b-853a-4b7e-b122-af811a160609";
export const CARBOHYDRATE_DEFAULT_ID = "e3c6d689-4f63-44ff-8844-5bd11e4ed5af";
export const CALORIES_DEFAULT_ID = "cdcc58c7-5c5f-454a-9728-0643afccf491";

export const ZERO_CHARACTERISTICS_SUM_DATA: ICharacteristicsSum[] = [
  {
    foodCharacteristicType: {
      id: PROTEIN_DEFAULT_ID,
      name: "Белки",
      userId: null,
      isDefault: true,
    },
    characteristicSumValue: 0,
  },
  {
    foodCharacteristicType: {
      id: FAT_DEFAULT_ID,
      name: "Жиры",
      userId: null,
      isDefault: true,
    },
    characteristicSumValue: 0,
  },
  {
    foodCharacteristicType: {
      id: CARBOHYDRATE_DEFAULT_ID,
      name: "Углеводы",
      userId: null,
      isDefault: true,
    },
    characteristicSumValue: 0,
  },
  {
    foodCharacteristicType: {
      id: CALORIES_DEFAULT_ID,
      name: "Калории",
      userId: null,
      isDefault: true,
    },
    characteristicSumValue: 0,
  },
];
