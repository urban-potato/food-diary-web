import { FC } from "react";
import CharacteristicTilesList from "../../../../components/CharacteristicTilesList/CharacteristicTilesList";
import ConsumedDishesList from "../ConsumedDishesList/ConsumedDishesList";
import {
  ICharacteristicsSum,
  IConsumedElementary,
  IConsumedRecipe,
} from "../../../../global/types/types";

type TProps = {
  consumedElementaries: IConsumedElementary[];
  consumedRecipes: IConsumedRecipe[];
  characteristicsSum: ICharacteristicsSum[];
};

const MealInfo: FC<TProps> = ({
  consumedElementaries,
  consumedRecipes,
  characteristicsSum,
}) => {
  return (
    <div className="mt-4 flex flex-col gap-y-5">
      {consumedElementaries.length > 0 ? (
        <ConsumedDishesList consumedDishes={consumedElementaries} />
      ) : null}
      {consumedRecipes.length > 0 ? (
        <ConsumedDishesList consumedDishes={consumedRecipes} />
      ) : null}
      <div className="flex flex-wrap gap-3 w-full">
        <CharacteristicTilesList characteristicsList={characteristicsSum} />
      </div>
    </div>
  );
};

export default MealInfo;
