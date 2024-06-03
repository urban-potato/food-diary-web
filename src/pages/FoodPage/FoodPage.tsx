import { FC } from "react";
import { FoodElementaryModule } from "../../modules/FoodElementaryModule/index.ts";
import { FoodRecipeModule } from "../../modules/FoodRecipeModule/index.tsx";
import FoodPageHeader from "./FoodPageHeader.tsx";
import { useParams } from "react-router-dom";
import { FOOD_TYPE } from "../../global/constants/constants.ts";
import ErrorPage from "../ErrorPage/ErrorPage.tsx";

const FoodPage: FC = () => {
  const params = useParams();

  const foodType = params.type ?? FOOD_TYPE.simple;

  if (foodType != FOOD_TYPE.simple && foodType != FOOD_TYPE.complex) {
    return <ErrorPage />;
  }

  return (
    <section className="flex flex-col h-fit w-full flex-grow">
      <FoodPageHeader foodType={foodType} />

      {foodType === FOOD_TYPE.simple ? (
        <FoodElementaryModule />
      ) : foodType === FOOD_TYPE.complex ? (
        <FoodRecipeModule />
      ) : null}
    </section>
  );
};

export default FoodPage;
