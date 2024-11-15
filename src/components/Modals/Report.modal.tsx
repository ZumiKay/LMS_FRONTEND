import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

import {
  SelectItem,
  Select as Selects,
  SelectSection,
} from "@nextui-org/react";
import Selection from "../Selection";
import { ChangeEvent, useEffect, useState } from "react";
import { ApiRequest } from "../../utilities/helper";
import { SelectionDataType } from "../../types/helpertype.type";
import DatePickerInput from "../DatePicker";
import toast from "react-hot-toast";
import { Progress } from "@nextui-org/react";
import { FacultyType } from "../../types/user.type";

interface ExportReportType {
  name: string;
  department: string;
  information: string;
  informationtype: string;
  startdate: string;
  enddate: string;
}

const information: SelectionDataType[] = [
  { label: "Library Entry", value: "entry" },
  { label: "Library Entry and Borrow Book", value: "both" },
];

const informationType: SelectionDataType[] = [
  { label: "Short Detail", value: "short" },
  { label: "Full Detail", value: "long" },
];

export default function ReportModal({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) {
  const [toastid, settoastid] = useState<string | null>(null);
  const [loading, setloading] = useState(false);
  const [dep, setdep] = useState<FacultyType[]>([]);

  const [filterdata, setfilter] = useState<ExportReportType>({
    name: "",
    department: "",
    information: "",
    informationtype: "",
    startdate: "",
    enddate: "",
  });

  useEffect(() => {
    const getdepartment = async () => {
      setloading(true);
      const response = await ApiRequest({
        url: "/getdepartment",
        method: "GET",
        cookies: true,
      });
      setloading(false);

      if (response.success) {
        setdep(response.data as FacultyType[]);
      }
    };
    getdepartment();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setfilter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog
      open={open}
      onClose={() => close()}
      PaperProps={{
        component: "form",
        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          if (toastid) {
            toast.dismiss(toastid);
            settoastid(null);
          }

          if (
            filterdata.name.length === 0 ||
            filterdata.department.length === 0 ||
            filterdata.startdate.length === 0 ||
            filterdata.enddate.length === 0
          ) {
            settoastid(toast.error("Missing Required Input"));
            return;
          }

          setloading(true);

          const response = await ApiRequest({
            url: "/generatereport",
            method: "POST",
            cookies: true,
            blob: true,
            data: { ...filterdata },
          });

          setloading(false);

          if (!response.success) {
            settoastid(toast.error("Can't Generate Report"));
            return;
          }

          // Handle the Excel file download

          const url = window.URL.createObjectURL(response.data as Blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${filterdata.name}.xlsx`); // Use the name from filterdata for the file
          document.body.appendChild(link);
          link.click();
          link.parentNode?.removeChild(link);

          settoastid(toast.success("Report generated successfully"));
        },
      }}
    >
      <DialogTitle>Generate Report</DialogTitle>
      <DialogContent className="w-[600px] max-sm:w-[280px]">
        {loading && <Progress isIndeterminate color="primary" size="sm" />}
        <DialogContentText> Filtering Option </DialogContentText>

        <div className="input_container w-full h-fit flex flex-col gap-y-5">
          <TextField
            autoFocus
            required
            margin="dense"
            name="name"
            label="File Name"
            type="text"
            fullWidth
            onChange={handleChange as never}
            variant="standard"
          />
          <Selects
            label="Department"
            placeholder="Filter Department"
            className="w-full"
            size="md"
            name="department"
            variant="bordered"
            value={filterdata.department}
            onChange={handleChange}
          >
            {dep.map((data) => (
              <SelectSection key={data.id} showDivider title={data.name}>
                {data.departments.map((department) => (
                  <SelectItem key={department.department as string}>
                    {department.department}
                  </SelectItem>
                ))}
              </SelectSection>
            ))}
          </Selects>
          <Selection
            label="Information"
            width="100%"
            name="information"
            value={filterdata.information}
            selectdata={information}
            handleChange={handleChange as never}
          />
          <Selection
            label="Information Type"
            selectdata={informationType}
            width="100%"
            name="informationtype"
            value={filterdata.informationtype}
            handleChange={handleChange as never}
          />

          <p className="text-medium font-bold">Date Range *</p>
          <DatePickerInput
            handleChange={(val) =>
              setfilter((prev) => ({
                ...prev,
                startdate: val ? val.toISOString() : "",
              }))
            }
            label="Start Date"
          />
          <DatePickerInput
            handleChange={(val) =>
              setfilter((prev) => ({
                ...prev,
                enddate: val ? val.toISOString() : "",
              }))
            }
            label="End Date"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={loading && <CircularProgress color="inherit" />}
          type="submit"
        >
          Export
        </Button>
        <Button onClick={() => close()} type="button" color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
