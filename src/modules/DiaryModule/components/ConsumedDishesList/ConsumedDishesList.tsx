import { FC } from "react";
import ConsumedDishTile from "./ConsumedDishTile";
import {
  IConsumedElementary,
  IConsumedRecipe,
} from "../../../../global/types/types";

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
  return (
    <div className="flex flex-col gap-3 max-w-max">{mappedConsumedDishes}</div>
  );
};

export default ConsumedDishesList;
