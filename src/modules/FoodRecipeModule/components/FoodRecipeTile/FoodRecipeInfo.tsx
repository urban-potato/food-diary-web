import { FC } from "react";
import CharacteristicTilesList from "../../../../components/CharacteristicTilesList/CharacteristicTilesList";
import {
  ICharacteristicsSum,
  IIngredient,
} from "../../../../global/types/entities-types";
import Ingredients from "../Ingredients";
import {
  BASIC_NUTRIENTS_IDS_LIST,
  CALORIES_DEFAULT_ID,
} from "../../../../global/constants/constants";

type TProps = {
  foodRecipeName: string;
  ingredients: IIngredient[];
  characteristicsSum: ICharacteristicsSum[];
};

const FoodRecipeInfo: FC<TProps> = ({
  foodRecipeName,
  ingredients,
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
    <section className="flex flex-col w-full gap-5 -mt-6">
      <div className="flex w-full">
        <p className="text-xl font-bold truncate">{foodRecipeName}</p>
        <div className="ml-auto gap-x-2 flex justify-center items-start w-16 flex-shrink-0"></div>
      </div>

      {ingredients.length > 0 ? (
        <div className="flex flex-col w-full">
          <div className="font-semibold mb-1 text-[17px] truncate">Состав:</div>
          <div className="flex flex-wrap gap-3 w-full">
            <Ingredients ingredients={ingredients} />
          </div>
        </div>
      ) : null}

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
  );
};

export default FoodRecipeInfo;
