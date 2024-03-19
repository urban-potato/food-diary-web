import Preloader from "../../../components/Preloader/Preloader";
import {
  useGetCourseMealDayByDateQuery,
  useLazyGetCourseMealDayByDateQuery,
} from "../api/meals.api";
import { getFormattedDateTime } from "../helpers/helpers";

const MealsList = () => {
  // const [
  //   doLazyGetCourseMealDayByDate,
  //   { isLoading: isLoadingLazyGetCourseMealDayByDate },
  // ] = useLazyGetCourseMealDayByDateQuery();

  const [date, time] = getFormattedDateTime();

  const { isLoading: isLoadingCourseMealDay, data: dataCourseMealDay } =
    useGetCourseMealDayByDateQuery(date);

  const mealDay = dataCourseMealDay;
  console.log("mealDay", mealDay);

  const mealsItems = [];

  return (
    <div
      className="w-full max-w-full
    flex flex-col justify-center items-center
    mt-3
    
    "
    >
      <div className="text-2xl font-bold  ">
        {mealDay?.items[0]?.courseMealDate}
      </div>

      {mealsItems}

      {isLoadingCourseMealDay ? (
        <span className="m-10">
          <Preloader />
        </span>
      ) : null}
    </div>
  );
};

export default MealsList;
