import { FC } from "react";
import Preloader from "../../../components/Preloader/Preloader";
import { useGetAllFoodRecipeQuery } from "../api/foodRecipe.api";
import { IFoodRecipe } from "../../../global/types/types";
import FoodRecipeTile from "./FoodRecipeTile/FoodRecipeTile";

const FoodRecipesList: FC = () => {
  const {
    isLoading: isLoadingGetAllFoodRecipe,
    data: dataGetAllFoodRecipe,
    error: errorGetAllFoodRecipe,
  } = useGetAllFoodRecipeQuery(undefined);

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
