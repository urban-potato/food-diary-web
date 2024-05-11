import { FC } from "react";
import IngredientTile from "./IngredientTile";
import { IIngredient } from "../../../global/types/types";

type TProps = {
  ingredients: IIngredient[];
};

const Ingredients: FC<TProps> = ({ ingredients }) => {
  const mappedFoodElementariesList = ingredients.map(
    (ingredient: IIngredient) => {
      const name = ingredient.foodElementary.name;
      const weight = ingredient.elementaryWeight;

      return (
        <IngredientTile
          key={`mappedFoodElementariesList_${ingredient.foodElementary.id}`}
          name={name}
          weight={weight}
        />
      );
    }
  );

  return (
    <div className="flex flex-col gap-3 max-w-max">
      {mappedFoodElementariesList}
    </div>
  );
};

export default Ingredients;
