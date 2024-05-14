import { IFoodCharacteristic } from "../../../global/types/types";

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
