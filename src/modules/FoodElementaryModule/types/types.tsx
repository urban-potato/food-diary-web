import { IFoodCharacteristic } from "../../../global/types/types";

export interface FoodElementaryData {
  name: string;
  proteinValue?: number;
  fatValue?: number;
  carbohydrateValue?: number;
  caloriesValue?: number;
}

export interface FoodCharacteristicProps {
  name: string;
  value: number;
}

export interface ILocalFoodCharacteristic extends IFoodCharacteristic {
  localId: number;
}

export interface FoodElementaryPieceProps {
  id: string;
  name: string;
  characteristics: any;
}

export interface FoodElementaryPieceEditProps {
  id: string;
  name: string;
  characteristics: any;
  setIsEditMode: any;
}
