import { memo } from "react";
import type { FC } from "react";
import CalendarUI from "react-calendar";
import type { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { TCalendarValue } from "../types/types";
import "../styles/Calendar.scss";

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

  const onActiveStartDateChange: CalendarProps["onActiveStartDateChange"] = (
    props
  ) => {
    // if (props.action === "prev2") {
    //   return;
    // }

    // isNull(props.activeStartDate)
    //   ? setActiveDate(undefined)
    //   : setActiveDate(props.activeStartDate);
    // isNull(props.activeStartDate)
    //   ? onChange(undefined)
    //   : onChange(props.activeStartDate);
    console.log("onActiveStartDateChange props", props);
  };

  return (
    <CalendarUI
      {...props}
      className="Calendar"
      //   className="Calendar rounded-2xl border-0"
      locale={locale}
      maxDate={maxDate}
      minDate={minDate}
      onActiveStartDateChange={onActiveStartDateChange}
      onClickDay={handleClickDay}
      tileClassName="Calendar-DayTile" // Class name(s) that will be applied to a given calendar item (day on month view, month on year view and so on).
      value={value}
    />
  );
};

export const Calendar = memo(CalendarComponent);
