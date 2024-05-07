import { FC } from "react";
import { IConsumedRecipe } from "../types/types";

type TProps = {
  consumedRecipes: IConsumedRecipe[];
};

const MealRecipes: FC<TProps> = ({ consumedRecipes }) => {
  return <div>MealRecipes</div>;
};

export default MealRecipes;
