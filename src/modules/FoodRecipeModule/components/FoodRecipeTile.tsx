import { FC, useRef, useState } from "react";
import { Player } from "@lordicon/react";
import EDIT_ICON from "../../../global/assets/system-regular-63-settings-cog.json";
import DELETE_ICON from "../../../global/assets/system-regular-39-trash.json";
import { useDeleteFoodRecipeMutation } from "../api/foodRecipe.api";
import FoodRecipeEditForm from "./FoodRecipeEditForm";
import Ingredients from "./Ingredients";
import { IFoodRecipe, IIngredient } from "../../../global/types/types";
import CharacteristicsSumList from "../../../components/CharacteristicsSum/CharacteristicsSumList";

type TProps = {
  foodRecipe: IFoodRecipe;
};

const FoodRecipeTile: FC<TProps> = ({ foodRecipe }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [doDeleteFoodRecipe] = useDeleteFoodRecipeMutation();
  const deleteFoodRecipe = () => {
    doDeleteFoodRecipe(foodRecipe.id).catch((e: any) => console.log(e));
  };

  const editIconPlayerRef = useRef<Player>(null);
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  const sortedIngredients = foodRecipe.ingredients
    .slice()
    .sort((a: IIngredient, b: IIngredient) =>
      a.foodElementary.name.localeCompare(b.foodElementary.name)
    );

  return (
    <div className="outer_box_style group w-full max-w-5xl mt-5">
      <div className="box_style "></div>
      <div className="box_content_transition flex flex-col flex-wrap w-full ">
        {isEditMode ? (
          <FoodRecipeEditForm
            key={`FoodRecipeEditForm_${foodRecipe.id}`}
            foodRecipeId={foodRecipe.id}
            originalFoodRecipeName={foodRecipe.name}
            ingredients={sortedIngredients}
            setIsEditMode={setIsEditMode}
          />
        ) : (
          <div
            key={`FoodRecipe_${foodRecipe.id}`}
            className="w-full max-w-5xl flex flex-col justify-center items-start pl-7 pr-6 py-7 gap-4"
          >
            <div className="w-full max-w-5xl  flex justify-center items-center">
              <div className="ml-1 flex gap-5 justify-center items-center self-center">
                <div className="text-xl font-bold">{foodRecipe.name}</div>
              </div>

              <div className="mr-0 mx-auto justify-self-end gap-x-2 flex justify-center items-start">
                <span role="button" onClick={() => setIsEditMode(!isEditMode)}>
                  <span
                    onMouseEnter={() =>
                      editIconPlayerRef.current?.playFromBeginning()
                    }
                  >
                    <Player
                      ref={editIconPlayerRef}
                      icon={EDIT_ICON}
                      size={ICON_SIZE}
                      colorize="#0d0b26"
                    />
                  </span>
                </span>

                <span role="button" onClick={() => deleteFoodRecipe()}>
                  <span
                    onMouseEnter={() =>
                      deleteIconPlayerRef.current?.playFromBeginning()
                    }
                  >
                    <Player
                      ref={deleteIconPlayerRef}
                      icon={DELETE_ICON}
                      size={ICON_SIZE}
                      colorize="#0d0b26"
                    />
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-y-5 max-w-5xl justify-center items-start">
              {sortedIngredients.length > 0 ? (
                <Ingredients ingredients={sortedIngredients} />
              ) : null}
              <div className="flex flex-wrap gap-3 w-full">
                <CharacteristicsSumList
                  characteristicsSum={foodRecipe.characteristicsSum}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodRecipeTile;
