import { FC } from "react";
import { IConsumedRecipe } from "../types/types";
import ConsumedRecipeTile from "./ConsumedRecipeTile";

type TProps = {
  consumedRecipes: IConsumedRecipe[];
};

const MealRecipes: FC<TProps> = ({ consumedRecipes }) => {
  const mappedConsumedRecipes = consumedRecipes.map(
    (recipe: IConsumedRecipe) => {
      return (
        <ConsumedRecipeTile
          key={`mappedConsumedRecipes${recipe.id}`}
          consumedRecipe={recipe}
        />
      );
    }
  );

  return (
    <div className="flex flex-col gap-3 max-w-max">{mappedConsumedRecipes}</div>
  );
};

export default MealRecipes;
