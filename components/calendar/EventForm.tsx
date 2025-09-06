"use client";

import { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

// 定義組件的 props 介面
interface DatePickerComponentProps {
  onChange: (dates: DateObject[]) => void;
}

const DatePickerComponent = ({ onChange }: DatePickerComponentProps) => {
  const [values, setValues] = useState<DateObject[]>([]);

  const handleChange = (newValues: DateObject[]) => {
    setValues(newValues);
    onChange(newValues);
    console.log("Selected dates:", newValues);
  };

  return (
    <DatePicker
      multiple
      plugins={[<DatePanel key="date-panel" />]}
      numberOfMonths={3}
      showOtherDays
      value={values}
      onChange={handleChange}
    />
  );
};

export default DatePickerComponent;