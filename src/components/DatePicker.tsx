import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DatePickerInput({
  value,
  handleChange,
  label,
  readonly,
}: {
  value?: Date;
  label: string;
  handleChange: (value: dayjs.Dayjs | null) => void;
  readonly?: boolean;
}) {
  const [data, setValue] = React.useState<Dayjs | null>(null);

  React.useEffect(() => {
    setValue(dayjs(value ?? null));
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        sx={{ width: "100%" }}
        label={label}
        value={data}
        onChange={(newValue) => {
          setValue(newValue);
          handleChange(newValue);
        }}
        readOnly={readonly}
      />
    </LocalizationProvider>
  );
}
