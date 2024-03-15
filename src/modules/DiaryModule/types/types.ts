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
  characteristicsSum: ICharacteristicsSum[];
}

export interface ICourseMeal {
  id: string;
  userId: string;
  consumedElementaries: {
    id: string;
    foodElementary: IFoodElementaryItem;
    elementaryInMealWeight: number;
  }[];
  consumedRecipes: {
    id: string;
    foodRecipe: IFoodRecipe;
    recipeInMealWeight: number;
  }[];
  characteristicsSum: ICharacteristicsSum[];
  creationTime: string;
  mealTypeId: string;
  mealTypeName: string;
  courseMealDayId: string;
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
  characteristicsSum: ICharacteristicsSum[];
}

export interface ICharacteristicsSum {
  foodCharacteristicType: IFoodCharacteristicType[];
  characteristicSumValue: number;
}

export interface IFoodCharacteristicType {
  id: string;
  name: string;
  userId: string;
  isDefault: boolean;
}
