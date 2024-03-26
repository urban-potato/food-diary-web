import { useState } from "react";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import MealCreateForm from "./MealCreateForm";
import MealsList from "./MealsList";
import { TCalendarValue } from "../types/types";
import { ru } from "date-fns/locale";
import { Calendar } from "./Calendar";
import { format } from "date-fns";

const DiaryModule = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [valueCalendar, setValueCalendar] = useState<TCalendarValue>(
    new Date()
  );

  const formattedDate = format(valueCalendar, "yyyy-MM-dd", { locale: ru });

  return (
    <section className="h-full w-full flex flex-wrap lg:flex-nowrap gap-3 justify-start">
      <section className="lg:w-[20%] w-full flex justify-center items-center self-start">
        <Calendar
          locale={ru.code}
          setValueCalendar={setValueCalendar}
          value={valueCalendar}
          maxDate={new Date()}
        />
      </section>

      <section className="flex flex-col justify-start items-center py-3 w-full max-w-5xl">
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

        <MealsList date={formattedDate} />
      </section>

      <section className="sm:w-[30%] w-full flex justify-center items-center"></section>
    </section>
  );
};

export default DiaryModule;
