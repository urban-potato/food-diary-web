import { FC, useState } from "react";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import MealCreateForm from "./MealCreateForm";
import MealsList from "./MealsList";
import { ru } from "date-fns/locale";
import { Calendar } from "./Calendar/Calendar";
import { format } from "date-fns";
import { useGetCourseMealDayByDateQuery } from "../api/meal.api";
import DayCharacteristicsSumTile from "./DayCharacteristicsSumTile/DayCharacteristicsSumTile";

type TProps = {
  dateString?: string;
};

const DiaryModule: FC<TProps> = ({ dateString }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const nowDate = new Date();
  const requiredDate = !!dateString ? new Date(dateString) : nowDate;
  const formattedDate = format(requiredDate, "yyyy-MM-dd", { locale: ru });

  const { isLoading: isLoadingCourseMealDay, data: dataCourseMealDay } =
    useGetCourseMealDayByDateQuery(formattedDate);

  return (
    <section className="h-full w-full flex flex-wrap lg:flex-nowrap gap-3 justify-center">
      <section className="lg:w-[20%] w-full flex flex-wrap justify-center items-center self-start lg:order-1 gap-5">
        <Calendar
          locale={ru.code}
          value={requiredDate}
          maxDate={nowDate}
          className="flex-grow-1"
        />

        <div className="flex-grow-1 lg:hidden max-w-max flex flex-wrap gap-3 w-full">
          <DayCharacteristicsSumTile
            characteristicsSum={
              dataCourseMealDay?.items?.length > 0
                ? dataCourseMealDay?.items[0]?.characteristicsSum
                : []
            }
          />
        </div>
      </section>

      <section className="flex flex-col justify-start items-center py-3 w-full max-w-5xl lg:order-2 order-3">
        <span className="my-3 w-full max-w-[280px]">
          <ButtonIlluminated
            children={showCreateForm ? "Скрыть" : "Новая запись"}
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            illuminationVariant={showCreateForm ? "full" : "light"}
            buttonVariant={showCreateForm ? "dark" : "light"}
          />
        </span>

        {showCreateForm ? (
          <MealCreateForm
            setShowCreateForm={setShowCreateForm}
            showCreateForm={showCreateForm}
            date={formattedDate}
          />
        ) : null}

        <MealsList
          date={formattedDate}
          isLoadingCourseMealDay={isLoadingCourseMealDay}
          dataCourseMealDay={dataCourseMealDay}
        />
      </section>

      <section className="lg:w-[30%] lg:order-3 order-2 hidden lg:block">
        <DayCharacteristicsSumTile
          characteristicsSum={
            dataCourseMealDay?.items?.length > 0
              ? dataCourseMealDay?.items[0]?.characteristicsSum
              : []
          }
        />
      </section>
    </section>
  );
};

export default DiaryModule;
