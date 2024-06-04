import { FC } from "react";
import CharacteristicTilesList from "../../../../components/CharacteristicTilesList/CharacteristicTilesList";
import ConsumedDishesList from "../ConsumedDishesList/ConsumedDishesList";
import {
  ICharacteristicsSum,
  IConsumedElementary,
  IConsumedRecipe,
} from "../../../../global/types/entities-types";
import {
  BASIC_NUTRIENTS_IDS_LIST,
  CALORIES_DEFAULT_ID,
} from "../../../../global/constants/constants";

type TProps = {
  creationTime: string;
  mealTypeName: string;
  consumedElementaries: IConsumedElementary[];
  consumedRecipes: IConsumedRecipe[];
  characteristicsSum: ICharacteristicsSum[];
};

const MealTileBody: FC<TProps> = ({
  creationTime,
  mealTypeName,
  consumedElementaries,
  consumedRecipes,
  characteristicsSum,
}) => {
  const nutrients = characteristicsSum.filter(
    (item) =>
      (item.foodCharacteristicType.id != CALORIES_DEFAULT_ID &&
        item.characteristicSumValue > 0) ||
      BASIC_NUTRIENTS_IDS_LIST.includes(item.foodCharacteristicType.id)
  );

  const calories = characteristicsSum.filter(
    (item) => item.foodCharacteristicType.id == CALORIES_DEFAULT_ID
  );

  return (
    <>
      <section className="flex flex-col w-full gap-5 -mt-6">
        <div className="flex w-full">
          <div className="flex gap-5 truncate">
            <p className="text-xl font-bold truncate">
              {creationTime.split(".")[0].split(":").slice(0, 2).join(":")}
            </p>
            <p className="text-xl font-bold truncate">{mealTypeName}</p>
          </div>
          <div className="ml-auto gap-x-2 flex justify-center items-start w-16 flex-shrink-0"></div>
        </div>

        <div className="flex flex-col w-full">
          <div className="font-semibold mb-1 text-[17px] truncate">Состав:</div>
          <div className="flex flex-wrap gap-3 w-full">
            {consumedElementaries.length > 0 ? (
              <ConsumedDishesList consumedDishes={consumedElementaries} />
            ) : null}
            {consumedRecipes.length > 0 ? (
              <ConsumedDishesList consumedDishes={consumedRecipes} />
            ) : null}
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="font-semibold mb-1 text-[17px] truncate">
            Калорийность:
          </div>
          <div className="flex flex-wrap gap-3 w-full">
            <CharacteristicTilesList characteristicsList={calories} />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="font-semibold mb-1 text-[17px] truncate">
            Нутриенты:
          </div>
          <div className="flex flex-wrap gap-3 w-full">
            <CharacteristicTilesList characteristicsList={nutrients} />
          </div>
        </div>
      </section>
    </>
  );
};

export default MealTileBody;
