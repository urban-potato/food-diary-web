import { FC } from "react";
import { IConsumedRecipe } from "../types/types";
import MealElementaries from "./MealElementaries";

type TProps = {
  consumedRecipe: IConsumedRecipe;
};

const ConsumedRecipeTile: FC<TProps> = ({ consumedRecipe }) => {
  return (
    <div className="flex gap-x-5 w-full bg-near_white shadow-md rounded-xl p-3 justify-between">
      <div>
        <p>name:</p>
        <p>{consumedRecipe.foodRecipe.name}</p>
      </div>
      <MealElementaries
        consumedElementaries={consumedRecipe.foodRecipe.ingredients}
      />
      <div>
        <p>weight:</p>
        <p>{consumedRecipe.recipeInMealWeight}</p>
      </div>
    </div>
  );
};

export default ConsumedRecipeTile;
