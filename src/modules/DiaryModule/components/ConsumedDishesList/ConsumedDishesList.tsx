import { FC } from "react";
import ConsumedDishTile from "./ConsumedDishTile";
import {
  IConsumedElementary,
  IConsumedRecipe,
} from "../../../../global/types/entities-types";

type TProps = {
  consumedDishes: IConsumedElementary[] | IConsumedRecipe[];
};

const ConsumedDishesList: FC<TProps> = ({ consumedDishes }) => {
  const mappedConsumedDishes = consumedDishes.map(
    (dish: IConsumedElementary | IConsumedRecipe) => {
      let name;
      let weight;
      if ("foodRecipe" in dish) {
        name = dish.foodRecipe.name;
        weight = dish.recipeInMealWeight;
      } else {
        name = dish.foodElementary.name;
        weight = dish.elementaryInMealWeight;
      }

      return (
        <ConsumedDishTile
          key={`mappedConsumedElementaries_${dish.id}`}
          name={name}
          weight={weight}
        />
      );
    }
  );
  return <>{mappedConsumedDishes}</>;
};

export default ConsumedDishesList;
