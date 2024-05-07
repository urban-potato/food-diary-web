import { FC } from "react";
import Preloader from "../../../components/Preloader/Preloader";
import { useGetCourseMealDayByDateQuery } from "../api/meals.api";
import type { ICourseMeal } from "../types/types";
import MealTile from "./MealTile";

type TProps = {
  date: string;
};

const MealsList: FC<TProps> = ({ date }) => {
  const { isLoading: isLoadingCourseMealDay, data: dataCourseMealDay } =
    useGetCourseMealDayByDateQuery(date);

  const mealElementaries = dataCourseMealDay?.items[0]?.courseMeals
    ?.slice()
    .sort(function (a: ICourseMeal, b: ICourseMeal) {
      return a.creationTime.localeCompare(b.creationTime);
    })
    ?.map((meal: ICourseMeal) => {
      if (meal.consumedElementaries.length > 0) {
        return <MealTile key={`courseMeals_${meal.id}`} {...meal} />;
      }
    });

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
      ) : mealElementaries == null || mealElementaries.length == 0 ? (
        <div className="w-full  flex flex-col justify-center items-center mt-10 text-xl">
          Записей нет
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          {mealElementaries}
        </div>
      )}
    </div>
  );
};

export default MealsList;
