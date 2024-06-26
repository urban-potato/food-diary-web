import { FC, ReactElement } from "react";
import Preloader from "../../../components/Preloader/Preloader";
import MealTile from "./MealTile/MealTile";
import { ICourseMeal } from "../../../global/types/entities-types";

type TProps = {
  date: string;
  isLoadingCourseMealDay: boolean;
  dataCourseMealDay: any;
};

const MealsList: FC<TProps> = ({
  date,
  isLoadingCourseMealDay,
  dataCourseMealDay,
}) => {
  const mealTiles = dataCourseMealDay?.items[0]?.courseMeals
    ?.slice()
    ?.sort(function (a: ICourseMeal, b: ICourseMeal) {
      return a.creationTime.localeCompare(b.creationTime);
    })
    ?.map((meal: ICourseMeal) => {
      if (
        meal.consumedElementaries.length > 0 ||
        meal.consumedRecipes.length > 0
      ) {
        return (
          <MealTile
            key={`courseMeals_${meal.id}`}
            {...meal}
            mealDayId={dataCourseMealDay?.items[0]?.id}
          />
        );
      }
    })
    .filter((item: ReactElement | undefined) => item != undefined);

  return (
    <div className="w-full max-w-full flex flex-col justify-center items-center mt-3">
      <div className="text-2xl font-bold  ">
        {dataCourseMealDay?.items[0]?.courseMealDate
          ? dataCourseMealDay?.items[0]?.courseMealDate
          : date}
      </div>

      {isLoadingCourseMealDay ? (
        <span className="m-10">
          <Preloader />
        </span>
      ) : !mealTiles || mealTiles.length == 0 ? (
        <div className="w-full  flex flex-col justify-center items-center mt-10 text-xl">
          Записей нет
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          {mealTiles}
        </div>
      )}
    </div>
  );
};

export default MealsList;
