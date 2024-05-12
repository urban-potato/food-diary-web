import { useState } from "react";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import MealCreateForm from "./MealCreateForm";
import MealsList from "./MealsList";
import { TCalendarValue } from "../types/types";
import { ru } from "date-fns/locale";
import { Calendar } from "./Calendar";
import { format } from "date-fns";
import { useGetCourseMealDayByDateQuery } from "../api/meals.api";
import DaysCharacteristicsSum from "./DaysCharacteristicsSum";

const DiaryModule = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [valueCalendar, setValueCalendar] = useState<TCalendarValue>(
    new Date()
  );

  const formattedDate = format(valueCalendar, "yyyy-MM-dd", { locale: ru });

  const { isLoading: isLoadingCourseMealDay, data: dataCourseMealDay } =
    useGetCourseMealDayByDateQuery(formattedDate);

  return (
    <section className="h-full w-full flex flex-wrap lg:flex-nowrap gap-3 justify-center">
      <section className="lg:w-[20%] w-full flex flex-wrap justify-center items-center self-start lg:order-1 gap-5">
        <Calendar
          locale={ru.code}
          setValueCalendar={setValueCalendar}
          value={valueCalendar}
          maxDate={new Date()}
          className="flex-grow-1"
        />

        <div className="flex-grow-1 lg:hidden max-w-max ">
          <DaysCharacteristicsSum
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
            label={showCreateForm ? "Скрыть" : "Новая запись"}
            isDarkButton={showCreateForm}
            isIlluminationFull={showCreateForm ? true : false}
            onClick={() => setShowCreateForm(!showCreateForm)}
            buttonPadding=" p-[14px] "
          />
        </span>

        {showCreateForm ? (
          <MealCreateForm
            setShowCreateForm={setShowCreateForm}
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
        <DaysCharacteristicsSum
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
