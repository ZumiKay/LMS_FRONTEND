/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "../../style/style.css";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  FilterDateRangeType,
  ResultDataType,
  ResultSubDataType,
} from "../../types/summarystudent.type";
import { ApiRequest, generateSemesterArray } from "../../utilities/helper";
import toast from "react-hot-toast";
import {
  Button,
  SelectItem,
  Select as Selects,
  SelectSection,
} from "@nextui-org/react";
import { FacultyType } from "../../types/user.type";
import { useShowToast } from "../../config/customHook";
import { useGlobalContext } from "../../types/context.type";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SummaryStudentInfopage = () => {
  const { loading, setloading } = useGlobalContext();
  const [filterdate, setfilterdate] = useState<string[]>([]);
  const [datesrange, setrange] = useState<FilterDateRangeType[]>();

  const [filtereddata, setdata] = useState<ResultDataType>();
  const [filterrange, setfilterange] = useState<Array<FilterDateRangeType>>([]);
  const [dep, setdep] = useState<FacultyType[]>([]);
  const [selecteddep, setselecteddep] = useState("");
  const { ErrorToast } = useShowToast();

  const handlefilterrange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    const values = typeof value === "string" ? value.split(",") : value;
    const alldate = generateSemesterArray();
    const seleteddaterange: FilterDateRangeType[] = [];
    alldate
      .filter((i) => values.includes(i.name))
      .map((j) => seleteddaterange.push(j));

    setfilterange(seleteddaterange);
    setfilterdate(values);
  };

  const handleChange = async () => {
    if (filterrange.length === 0 || !selecteddep) {
      ErrorToast("Please Select All Required Field");
      return;
    }

    setloading(true);
    const response = await ApiRequest({
      url: "/getsummaryusage",
      method: "POST",
      cookies: true,
      data: { filtervalue: filterrange, department: selecteddep },
    });
    setloading(false);

    if (!response.success) {
      toast.error("Can't get data");
      return;
    }

    setdata(response.data as never);
  };

  useEffect(() => {
    setrange(generateSemesterArray());

    const getdepartment = async () => {
      const response = await ApiRequest({
        url: "/getdepartment",
        method: "GET",
        cookies: true,
      });

      if (response.success) {
        setdep(response.data as FacultyType[]);
      }
    };
    getdepartment();
  }, []);
  return (
    <div className="summary_container">
      <h1 className="title font-black bg-black p-2 text-white rounded-md">
        Summary Student Information
      </h1>
      <div className="filter_input flex flex-col gap-y-5">
        <FormControl sx={{ m: 1, width: "100%", borderRadius: "10px" }}>
          <InputLabel id="demo-multiple-checkbox-label">Filter</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={filterdate}
            onChange={handlefilterrange}
            input={<OutlinedInput label="Filter" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {datesrange?.map((name, idx) => (
              <MenuItem key={idx} value={name.name}>
                <Checkbox checked={filterdate.indexOf(name.name) > -1} />
                <ListItemText primary={name.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Selects
          label="Department"
          placeholder="Filter Department"
          className="max-w-md"
          size="lg"
          variant="bordered"
          value={selecteddep}
          onChange={(e) => setselecteddep(e.target.value)}
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
      </div>
      <Button
        onClick={() => handleChange()}
        className="max-w-xl"
        variant="flat"
        color="primary"
        isLoading={loading}
      >
        Search
      </Button>
      <div className="information_container">
        <CollapsibleTable data={filtereddata ?? {}} />
      </div>
    </div>
  );
};

export default SummaryStudentInfopage;

function Row({ row, term }: { row: ResultSubDataType; term: string }) {
  const [open, setOpen] = React.useState(false);
  const [opendropdown, setopendropdown] = useState<{ [key: string]: boolean }>(
    {}
  );

  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": {
            borderBottom: "10px solid white",
            paddingTop: "20px",
            backgroundColor: "#4682B4",
            fontWeight: "900",
            fontSize: "medium",
          },
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            style={{ color: "white" }}
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "white" }}>
          {term}
        </TableCell>
        <TableCell style={{ color: "white" }} align="right">
          {row.entry.total}
        </TableCell>
        <TableCell style={{ color: "white" }} align="right">
          {row.borrowedbook.total}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h5" gutterBottom component="div">
                LIBRARY ENTRY FOR {term}
              </Typography>
              <Table size="small" aria-label="library entry details">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell align="left">Monthly</TableCell>
                    <TableCell align="left">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(row.entry.monthly).map(([month, details]) => (
                    <React.Fragment key={`entry-${month}`}>
                      <TableRow>
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() =>
                              setopendropdown({
                                ...opendropdown,
                                [month]: !opendropdown[month],
                              })
                            }
                          >
                            {opendropdown[month] ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {month}
                        </TableCell>
                        <TableCell align="left">{details.monthCount}</TableCell>
                      </TableRow>
                      <Collapse
                        in={opendropdown[month]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 1 }}>
                          <Table size="small" aria-label="weekly details">
                            <TableHead>
                              <TableRow>
                                <TableCell align="center">Week 1</TableCell>
                                <TableCell align="center">Week 2</TableCell>
                                <TableCell align="center">Week 3</TableCell>
                                <TableCell align="center">Week 4</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                {Object.values(details.weekly).map(
                                  (count, weekIndex) => (
                                    <TableCell
                                      align="center"
                                      key={`entry-week-${weekIndex + 1}`}
                                    >
                                      {count}
                                    </TableCell>
                                  )
                                )}
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </Box>

            <Box sx={{ margin: 1 }}>
              <Typography variant="h5" gutterBottom component="div">
                BORROWED BOOKS FOR {term}
              </Typography>
              <Table size="small" aria-label="borrowed book details">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell align="left">Monthly</TableCell>
                    <TableCell align="left">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(row.borrowedbook.monthly).map(
                    ([month, details]) => (
                      <React.Fragment key={`borrowed-${month}`}>
                        <TableRow>
                          <TableCell>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() =>
                                setopendropdown({
                                  ...opendropdown,
                                  [`borrowed-${month}`]:
                                    !opendropdown[`borrowed-${month}`],
                                })
                              }
                            >
                              {opendropdown[`borrowed-${month}`] ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {month}
                          </TableCell>
                          <TableCell align="left">
                            {details.monthCount}
                          </TableCell>
                        </TableRow>
                        <Collapse
                          in={opendropdown[`borrowed-${month}`]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="weekly details">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="center">Week 1</TableCell>
                                  <TableCell align="center">Week 2</TableCell>
                                  <TableCell align="center">Week 3</TableCell>
                                  <TableCell align="center">Week 4</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  {Object.values(details.weekly).map(
                                    (count, weekIndex) => (
                                      <TableCell
                                        align="center"
                                        key={`borrowed-week-${weekIndex + 1}`}
                                      >
                                        {count}
                                      </TableCell>
                                    )
                                  )}
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </React.Fragment>
                    )
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function CollapsibleTable({ data }: { data: ResultDataType }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>TERM</TableCell>
            <TableCell align="right">LIBRARY ENTRY TOTAL</TableCell>
            <TableCell align="right">BORROWED BOOK TOTAL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(data).map(([term, row]) => (
            <Row row={row} term={term} key={term} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
