import * as React from "react";
import moment from "moment";
import { DatePicker as BaseDatePicker } from "antd";

export const DatePicker = ({ showTime, onChange, ...props }) => {
  const handleChange = date => {
    if (onChange) {
      // Always output ISO8601 format
      onChange(
        date,
        date
          ? date.format(
              !showTime
                ? moment.HTML5_FMT.DATE
                : `${moment.HTML5_FMT.DATE} ${moment.HTML5_FMT.TIME}`
            )
          : undefined
      );
    }
  };

  return (
    <BaseDatePicker
      {...props}
      showTime={showTime ? { format: "HH:mm" } : undefined}
      format={!showTime ? "DD/MM/YYYY" : `DD/MM/YYYY h:mm A`}
      onChange={handleChange}
    />
  );
};

export default React.memo(DatePicker);
