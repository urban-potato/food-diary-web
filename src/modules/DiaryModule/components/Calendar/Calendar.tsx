import { memo } from "react";
import type { FC } from "react";
import CalendarUI from "react-calendar";
import type { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.scss";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export type TCalendarValue = Date;

type TProps = {
  locale?: string;
  maxDate?: Date;
  minDate?: Date;
  value?: TCalendarValue;
} & CalendarProps;

const CalendarComponent: FC<TProps> = ({
  locale,
  maxDate,
  minDate,
  value,
  ...rest
}) => {
  const navigate = useNavigate();

  const handleClickDay = (value: Date) => {
    const formattedDate = format(value, "yyyy-MM-dd", { locale: ru });

    navigate(`/diary/${formattedDate}`);
  };

  return (
    <CalendarUI
      {...rest}
      className="Calendar shadow-lg rounded-xl"
      locale={locale}
      maxDate={maxDate}
      minDate={minDate}
      onClickDay={handleClickDay}
      tileClassName="Calendar-DayTile" // Class name(s) that will be applied to a given calendar item (day on month view, month on year view and so on).
      value={value}
    />
  );
};

export const Calendar = memo(CalendarComponent);
