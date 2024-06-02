import { memo } from "react";
import type { FC } from "react";
import CalendarUI from "react-calendar";
import type { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.scss";

export type TCalendarValue = Date;

type TProps = {
  locale?: string;
  maxDate?: Date;
  minDate?: Date;
  setValueCalendar: (date: Date) => void;
  value?: TCalendarValue;
} & CalendarProps;

const CalendarComponent: FC<TProps> = (props) => {
  const { locale, maxDate, minDate, setValueCalendar, value } = props;

  const handleClickDay = (value: Date) => {
    setValueCalendar(value);
  };

  return (
    <CalendarUI
      {...props}
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
