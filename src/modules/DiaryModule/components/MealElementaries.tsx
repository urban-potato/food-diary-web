import { FC } from "react";
import { IConsumedElementary } from "../types/types";
import ConsumedElementary from "./ConsumedElementary";

type TProps = {
  consumedElementaries: IConsumedElementary[];
};

const MealElementaries: FC<TProps> = ({ consumedElementaries }) => {
  const mappedConsumedElementaries = consumedElementaries.map(
    (elementary: IConsumedElementary) => {
      return (
        <ConsumedElementary
          key={`mappedConsumedElementaries_${elementary.id}`}
          foodElementaryName={elementary.foodElementary.name}
          elementaryInMealWeight={elementary.elementaryInMealWeight}
        />
      );
    }
  );

  return (
    <div className=" flex flex-col gap-3 max-w-max">
      {mappedConsumedElementaries}
    </div>
  );
};

export default MealElementaries;
