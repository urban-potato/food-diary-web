export interface MealCreateFormProps {
  setShowCreateForm: Function;
}

export interface MealData {
  foodElementaryList: {
    foodElementaryId: {
      label: string;
      value: string;
    };
    weight: number;
  }[];
}
