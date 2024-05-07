import { FC } from "react";
import { IConsumedElementary, IIngredient } from "../types/types";
import ConsumedElementaryTile from "./ConsumedElementaryTile";
import ShortUniqueId from "short-unique-id";

type TProps = {
  consumedElementaries: IConsumedElementary[] | IIngredient[];
};

const MealElementaries: FC<TProps> = ({ consumedElementaries }) => {
  const uid = new ShortUniqueId({ length: 32 });

  const mappedConsumedElementaries = consumedElementaries.map(
    (elementary: IConsumedElementary | IIngredient) => {
      let elementaryInMealWeight;

      if ("elementaryInMealWeight" in elementary) {
        elementaryInMealWeight = elementary.elementaryInMealWeight;
      } else {
        elementaryInMealWeight = elementary.elementaryWeight;
      }

      return (
        <ConsumedElementaryTile
          key={uid.rnd()}
          foodElementaryName={elementary.foodElementary.name}
          elementaryInMealWeight={elementaryInMealWeight}
        />
      );
    }
  );

  return (
    <div className="flex flex-col gap-3 max-w-max">
      {mappedConsumedElementaries}
    </div>
  );
};

export default MealElementaries;
