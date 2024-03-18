import Preloader from "../../../components/Preloader/Preloader";
import {} from "../api/meals.api";

const MealsList = () => {
  // const {
  //   isLoading: isLoadingGetAllCourseMealDaysByDate,
  //   data: dataGetAllCourseMealDaysByDate,
  //   error: errorGetAllCourseMealDaysByDate,
  // } = useGetAllCourseMealDaysByDateQuery(undefined);

  // const [doLazyGetCourseMealDay, doLazyGetCourseMealDayResult] =
  //   useLazyGetCourseMealDayQuery();

  const mealsItems = [];

  return (
    <div
      className="w-full max-w-full
    flex flex-col justify-center items-center
    mt-3
    
    "
    >
      <div className="text-2xl font-bold  ">Заголовок:</div>

      {mealsItems}

      {true ? (
        <span className="m-10">
          <Preloader />
        </span>
      ) : null}
    </div>
  );
};

export default MealsList;
