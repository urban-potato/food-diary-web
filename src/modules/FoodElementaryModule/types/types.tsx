export interface FoodElementaryData {
  name: string;
  proteinValue?: number;
  fatValue?: number;
  carbohydrateValue?: number;
  caloriesValue?: number;
}

export interface IFoodElementaryItem {
  id: string;
  name: string;
  userId: string;
  isDefault: boolean;
  characteristics: IFoodCharacteristic[];
}

export interface FoodElementaryCreateFormProps {
  setShowCreateForm: Function;
}

export interface FoodCharacteristicProps {
  name: string;
  value: number;
}

export interface IFoodCharacteristic {
  foodCharacteristicId: string;
  characteristicTypeId: string;
  characteristicName: string;
  value: number;
}

export interface ILocalFoodCharacteristic {
  foodCharacteristicId: string;
  characteristicTypeId: string;
  characteristicName: string;
  value: number;
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
