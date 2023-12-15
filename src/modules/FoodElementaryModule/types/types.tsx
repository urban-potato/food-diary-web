export interface IFoodElementaryPostData {
  name: string;
  proteinValue: number;
  fatValue: number;
  carbohydrateValue: number;
  caloriesValue: number;
}

export interface IFoodElementaryItem {
  id: string;
  name: string;
  userId: string;
  isDefault: boolean;
  characteristics: [any];
}

export interface IFoodCharacteristicProps {
  characteristicTypeId: string;
  name: string;
  value: number;
}

export interface IFoodCharacteristic {
  foodCharacteristicId: string;
  characteristicTypeId: string;
  characteristicName: string;
  value: number;
}

export interface FoodElementaryPieceViewProps {
    id: string;
    name: string;
    characteristics: [any];
}
