import { FC } from "react";
import Preloader from "../../../components/Preloader/Preloader";
import { useGetAllFoodRecipeQuery } from "../api/food-recipe.api";
import { IFoodRecipe } from "../../../global/types/entities-types";
import FoodRecipeTile from "./FoodRecipeTile/FoodRecipeTile";
import { useAppDispatch } from "../../../global/store/store-hooks";
import { useNavigate } from "react-router-dom";
import { handleApiCallError } from "../../../global/helpers/handle-api-call-error.helper";

const FoodRecipesList: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    isLoading: isLoadingGetAllFoodRecipe,
    data: dataGetAllFoodRecipe,
    isError: isErrorGetAllFoodRecipe,
    error: errorGetAllFoodRecipe,
  } = useGetAllFoodRecipeQuery(undefined);

  if (
    isErrorGetAllFoodRecipe &&
    errorGetAllFoodRecipe &&
    "status" in errorGetAllFoodRecipe
  ) {
    handleApiCallError({
      error: errorGetAllFoodRecipe,
      dispatch: dispatch,
      navigate: navigate,
    });
  }

  const totalFoodCount: number = dataGetAllFoodRecipe?.metadata.totalCount;

  const foodRecipesTiles = dataGetAllFoodRecipe?.items
    ?.slice()
    ?.sort((a: IFoodRecipe, b: IFoodRecipe) => a.name.localeCompare(b.name))
    ?.map((item: IFoodRecipe) => {
      if (item.ingredients.length > 0) {
        return (
          <FoodRecipeTile
            key={`foodRecipesTiles_${item.id}`}
            foodRecipe={item}
          />
        );
      }
    });

  return (
    <div className="w-full max-w-full flex flex-col justify-center items-center mt-3">
      <div className="text-2xl font-bold  ">
        Всего составных блюд: {totalFoodCount}
      </div>

      {isLoadingGetAllFoodRecipe ? (
        <span className="m-10">
          <Preloader />
        </span>
      ) : !foodRecipesTiles || foodRecipesTiles.length == 0 ? (
        <div className="w-full  flex flex-col justify-center items-center mt-10 text-xl">
          Составных блюд нет
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          {foodRecipesTiles}
        </div>
      )}
    </div>
  );
};

export default FoodRecipesList;
