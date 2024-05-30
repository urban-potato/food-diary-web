import { FC } from "react";
import IngredientTile from "./IngredientTile";
import { IIngredient } from "../../../global/types/entities-types";

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

  return <>{mappedFoodElementariesList}</>;
};

export default Ingredients;
