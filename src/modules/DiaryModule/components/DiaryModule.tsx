import { FC, useEffect, useRef, useState } from "react";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import MealCreateForm from "./MealCreateForm";
import MealsList from "./MealsList";
import { ru } from "date-fns/locale";
import { Calendar } from "./Calendar/Calendar";
import { format } from "date-fns";
import { useGetCourseMealDayByDateQuery } from "../api/meal.api";
import DayCharacteristicsSumTile from "./DayCharacteristicsSumTile/DayCharacteristicsSumTile";
import { Player } from "@lordicon/react";
import TEA_ICON from "../../../global/assets/tea.json";
import { handleApiCallError } from "../../../global/helpers/handle-api-call-error.helper";
import { useAppDispatch } from "../../../global/store/store-hooks";
import { useNavigate } from "react-router-dom";
import BaseNutrientsChartTile from "./BaseNutrientsChartTile/BaseNutrientsChartTile";
import { BASIC_CHARACTERISTICS_IDS_LIST } from "../../../global/constants/constants";
import { ICharacteristicsSum } from "../../../global/types/entities-types";

type TProps = {
  requiredDate: Date;
};

const DiaryModule: FC<TProps> = ({ requiredDate }) => {
  const teaIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 150;

  const [showCreateForm, setShowCreateForm] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const nowDate = new Date();
  nowDate.setHours(0, 0, 0, 0);
  requiredDate.setHours(0, 0, 0, 0);
  const formattedDate = format(requiredDate, "yyyy-MM-dd", { locale: ru });

  const {
    isLoading: isLoadingCourseMealDay,
    data: dataCourseMealDay,
    isError: isErrorCourseMealDay,
    error: errorCourseMealDay,
  } = useGetCourseMealDayByDateQuery(formattedDate);

  if (
    isErrorCourseMealDay &&
    errorCourseMealDay &&
    "status" in errorCourseMealDay
  ) {
    handleApiCallError({
      error: errorCourseMealDay,
      dispatch: dispatch,
      navigate: navigate,
    });
  }

  const isFutureDate = requiredDate > nowDate;

  useEffect(() => {
    teaIconPlayerRef.current?.playFromBeginning();
  }, []);

  return (
    <section className="h-full w-full max-w-full flex flex-wrap lg:flex-nowrap gap-3 justify-center">
      <section className="lg:w-[21%] lg:max-w-[21%] w-max max-w-full flex flex-wrap justify-center items-center self-start lg:order-1 gap-5">
        <Calendar
          locale={ru.code}
          value={requiredDate}
          maxDate={nowDate}
          className="flex-grow-1"
        />

        <div className="flex-grow-1 max-w-max flex flex-col w-full justify-center items-center">
          <BaseNutrientsChartTile
            nutrientsCaloriesData={
              dataCourseMealDay?.items?.length > 0
                ? dataCourseMealDay?.items[0]?.characteristicsSum.filter(
                    (item: ICharacteristicsSum) =>
                      BASIC_CHARACTERISTICS_IDS_LIST.includes(
                        item.foodCharacteristicType.id
                      )
                  )
                : []
            }
          />
        </div>

        <div className="flex-grow-1 lg:hidden max-w-full flex flex-wrap gap-3 w-full">
          <DayCharacteristicsSumTile
            characteristicsSum={
              dataCourseMealDay?.items?.length > 0
                ? dataCourseMealDay?.items[0]?.characteristicsSum
                : []
            }
            className="flex-row"
          />
        </div>
      </section>

      {isFutureDate ? (
        <section className="flex flex-col justify-start items-center py-3 w-full max-w-full lg:max-w-[55%] lg:order-2 order-3">
          <div className="text-2xl w-full flex flex-col justify-center items-center mt-10 ">
            <p className="block bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 font-bold">
              Поздравляем!
            </p>
            <p className="block bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 font-bold">
              Вы попали в будущее
            </p>
            <Player
              ref={teaIconPlayerRef}
              icon={TEA_ICON}
              size={ICON_SIZE}
              onComplete={() => teaIconPlayerRef.current?.playFromBeginning()}
            />
          </div>
        </section>
      ) : (
        <section className="flex flex-col justify-start items-center py-3 w-full max-w-full lg:max-w-[55%] lg:order-2 order-3">
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
      )}

      <section className="lg:w-[22%] lg:max-w-[22%] lg:order-3 order-2 hidden lg:block w-full max-w-full">
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
