import { IFoodElementaryItem } from "../../FoodElementaryModule";

export interface MealCreateFormProps {
  setShowCreateForm: Function;
}

export interface MealData {
  foodElementaryList: {
    foodElementaryId?: {
      label?: string | undefined;
      value: string;
    };
    weight: number;
  }[];
}

export interface MealTypeOptionsProps {
  selectedMealType: string;
  setSelectedMealType: React.Dispatch<React.SetStateAction<string>>;
}

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
  consumedRecipes: {
    id: string;
    foodRecipe: IFoodRecipe;
    recipeInMealWeight: number;
  }[];
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

export interface IFoodRecipe {
  id: string;
  name: string;
  userId: string;
  isDefault: boolean;
  ingredients: {
    foodElementary: IFoodElementaryItem;
    elementaryWeight: number;
  }[];
  characteristicsSum: IConsumedCharacteristic[];
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

export interface MealProps {
  id: string;
  creationTime: string;
  mealTypeName: string;
  consumedElementaries: IConsumedElementary[];
  characteristicsSum: IConsumedCharacteristic[];
}

export interface ConsumedCharacteristicProps {
  name: string;
  value: number;
}

export interface ConsumedElementaryProps {
  foodElementaryName: string;
  elementaryInMealWeight: number;
}
