export interface IUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface IMealType {
  id: string;
  name: string;
  userId: string;
  isDefault: boolean;
}

export interface IFoodElementary {
  id: string;
  name: string;
  userId: string;
  isDefault: boolean;
  characteristics: IFoodCharacteristic[];
}

export interface IFoodCharacteristic {
  foodCharacteristicId: string;
  characteristicTypeId: string;
  characteristicName: string;
  value: number;
}

export interface IFoodCharacteristicWithLocalId extends IFoodCharacteristic {
  localId: number;
  localName: string;
}

export interface ICourseMealDay {
  id: string;
  userId: string;
  courseMealDate: string;
  courseMeals: ICourseMeal[];
  characteristicsSum: ICharacteristicsSum[];
}

export interface ICourseMeal {
  id: string;
  userId: string;
  consumedElementaries: IConsumedElementary[];
  consumedRecipes: IConsumedRecipe[];
  characteristicsSum: ICharacteristicsSum[];
  creationTime: string;
  mealTypeId: string;
  mealTypeName: string;
  courseMealDayId: string;
}

export interface IConsumedElementary {
  id: string;
  foodElementary: IFoodElementary;
  elementaryInMealWeight: number;
}

export interface IConsumedRecipe {
  id: string;
  foodRecipe: IFoodRecipe;
  recipeInMealWeight: number;
}

export interface IFoodRecipe {
  id: string;
  name: string;
  userId: string;
  isDefault: boolean;
  ingredients: IIngredient[];
  characteristicsSum: ICharacteristicsSum[];
}

export interface IIngredient {
  foodElementary: IFoodElementary;
  elementaryWeight: number;
}

export interface ICharacteristicsSum {
  foodCharacteristicType: IFoodCharacteristicType;
  characteristicSumValue: number;
}

export interface ICharacteristicsSumWithLocalId extends ICharacteristicsSum {
  localId: number;
  localName: string;
}

export interface IFoodCharacteristicType {
  id: string;
  name: string;
  userId: string | null;
  isDefault: boolean;
}

export interface IFoodCharacteristicTypeWithLocalId
  extends IFoodCharacteristicType {
  localId: number;
  localName: string;
}
