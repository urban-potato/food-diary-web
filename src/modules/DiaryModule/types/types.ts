import { IFoodElementaryItem } from "../../FoodElementaryModule";

export interface ICourseMealDay {
  id: string;
  userId: string;
  courseMealDate: string;
  courseMeals: ICourseMeal[];
  characteristicsSum: IConsumedCharacteristic[];
}

export interface ICourseMeal {
  id: string;
  userId: string;
  consumedElementaries: IConsumedElementary[];
  consumedRecipes: IConsumedRecipe[];
  characteristicsSum: IConsumedCharacteristic[];
  creationTime: string;
  mealTypeId: string;
  mealTypeName: string;
  courseMealDayId: string;
}

export interface IConsumedElementary {
  id: string;
  foodElementary: IFoodElementaryItem;
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
  characteristicsSum: IConsumedCharacteristic[];
}

export interface IIngredient {
  foodElementary: IFoodElementaryItem;
  elementaryWeight: number;
}

export interface IConsumedCharacteristic {
  foodCharacteristicType: IFoodCharacteristicType;
  characteristicSumValue: number;
}

export interface IFoodCharacteristicType {
  id: string;
  name: string;
  userId: string;
  isDefault: boolean;
}

export interface IConsumedCharacteristicWithLocalId
  extends IConsumedCharacteristic {
  localId: number;
}

export type TCalendarValue = Date;
