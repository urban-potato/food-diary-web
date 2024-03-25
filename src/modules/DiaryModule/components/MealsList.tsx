import Preloader from "../../../components/Preloader/Preloader";
import { useGetCourseMealDayByDateQuery } from "../api/meals.api";
import { getFormattedDateTime } from "../helpers/helpers";
import { ICourseMeal } from "../types/types";
import Meal from "./Meal";

const MealsList = () => {
  const [date, time] = getFormattedDateTime();

  const { isLoading: isLoadingCourseMealDay, data: dataCourseMealDay } =
    useGetCourseMealDayByDateQuery(date);

  // const mealDay = dataCourseMealDay?.items[0]?.courseMeals
  //   ?.slice()
  //   .sort(function (a: ICourseMeal, b: ICourseMeal) {
  //     return a.creationTime.localeCompare(b.creationTime);
  //   });
  // console.log("mealDay", mealDay);

  const courseMeals = dataCourseMealDay?.items[0]?.courseMeals
    ?.slice()
    .sort(function (a: ICourseMeal, b: ICourseMeal) {
      return a.creationTime.localeCompare(b.creationTime);
    })
    ?.map((meal: ICourseMeal) => {
      if (meal.consumedElementaries.length > 0) {
        return (
          <Meal
            key={`courseMeals_${meal.id}`}
            id={meal.id}
            creationTime={meal.creationTime}
            mealTypeName={meal.mealTypeName}
            consumedElementaries={meal.consumedElementaries}
            characteristicsSum={meal.characteristicsSum}
          />
        );
      }
    });

  console.log("courseMeals", courseMeals);

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
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          {courseMeals}
        </div>
      )}
    </div>
  );
};

export default MealsList;
