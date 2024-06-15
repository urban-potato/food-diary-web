import { FC, useState } from "react";
import { useDeleteFoodRecipeMutation } from "../../api/food-recipe.api";
import FoodRecipeEditForm from "./FoodRecipeEditForm";
import {
  IFoodRecipe,
  IIngredient,
} from "../../../../global/types/entities-types";
import TileIcons from "../../../../components/TileIcons/TileIcons";
import FoodRecipeInfo from "./FoodRecipeInfo";
import { useAppDispatch } from "../../../../global/store/store-hooks";
import { useNavigate } from "react-router-dom";
import { handleApiCallError } from "../../../../global/helpers/handle-api-call-error.helper";
import LoaderWithBlock from "../../../../components/LoaderWithBlock/LoaderWithBlock";

type TProps = {
  foodRecipe: IFoodRecipe;
};

const FoodRecipeTile: FC<TProps> = ({ foodRecipe }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [mainlIsLoading, setMainIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [doDeleteFoodRecipe] = useDeleteFoodRecipeMutation();
  const deleteFoodRecipe = async () => {
    await doDeleteFoodRecipe(foodRecipe.id)
      .unwrap()
      .catch((error) => {
        handleApiCallError({
          error: error,
          dispatch: dispatch,
          navigate: navigate,
        });
      });
  };

  const sortedIngredients = foodRecipe.ingredients
    .slice()
    .sort((a: IIngredient, b: IIngredient) =>
      a.foodElementary.name.localeCompare(b.foodElementary.name)
    );

  return (
    <div className="outer_box_style group w-full max-w-5xl mt-5">
      <div className="box_style "></div>

      {mainlIsLoading && <LoaderWithBlock />}

      <div className="box_content_transition flex flex-col flex-wrap w-full justify-center items-start p-7">
        <div className="box_icons">
          <TileIcons
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            handleDelete={deleteFoodRecipe}
          />
        </div>

        {isEditMode ? (
          <FoodRecipeEditForm
            foodRecipeId={foodRecipe.id}
            originalFoodRecipeName={foodRecipe.name}
            ingredients={sortedIngredients}
            setIsEditMode={setIsEditMode}
            isEditMode={isEditMode}
            setMainIsLoading={setMainIsLoading}
          />
        ) : (
          <FoodRecipeInfo
            foodRecipeName={foodRecipe.name}
            ingredients={sortedIngredients}
            characteristicsSum={foodRecipe.characteristicsSum}
          />
        )}
      </div>
    </div>
  );
};

export default FoodRecipeTile;
