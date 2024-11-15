import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { SelectionDataType } from "../types/helpertype.type";
import {
  SelectItem,
  Select as Selects,
  Chip as Chips,
  Chip,
  Input,
  Button,
  Badge,
} from "@nextui-org/react";
import { ApiRequest } from "../utilities/helper";
import { useShowToast } from "../config/customHook";

interface SelectionProps {
  label: string;
  handleChange: (event: SelectChangeEvent) => void;
  value?: string | Array<string>;
  multiple?: boolean;
  selectdata: Array<SelectionDataType>;
  width?: string;
  required?: boolean;
  name?: string;
}
export default function Selection(props: SelectionProps) {
  const [data, setdata] = React.useState(props.value ?? "");

  const handleChange = (event: SelectChangeEvent) => {
    setdata(event.target.value);
    props.handleChange(event);
  };

  return (
    <FormControl sx={{ m: 1, width: props.width ?? "120px" }}>
      <InputLabel id="demo-simple-select-helper-label">
        {props.label}
      </InputLabel>
      <Select
        name={props.name}
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        value={data as string}
        fullWidth
        label={props.label}
        onChange={handleChange}
        required={props.required}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {props.selectdata.map((i, idx) => (
          <MenuItem key={idx} value={i.value}>
            {i.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

interface MultipleSelectionType {
  data: SelectionDataType[];
  label: string;
  value?: string[];
  onSelect?: (val: string[]) => void;
}
export function MuitpleSelection({
  data,
  label,
  value,
  onSelect,
}: MultipleSelectionType) {
  const [selectValues, setselectValues] = React.useState<Set<string>>(
    new Set(value ?? [""])
  );
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value.split(",");
    setselectValues(new Set(value));
    if (onSelect) onSelect(value);
  };

  return (
    <Selects
      items={[...data]}
      label={label}
      variant="bordered"
      isMultiline={true}
      selectedKeys={selectValues}
      selectionMode="multiple"
      placeholder="Select"
      labelPlacement="inside"
      size="lg"
      fullWidth
      onChange={handleSelectionChange}
      classNames={{
        base: "max-w-xs",
        trigger: "min-h-12 py-2",
      }}
      renderValue={(items) => {
        return (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Chips key={item.data?.value}>{item.data?.label}</Chips>
            ))}
          </div>
        );
      }}
    >
      {(items) => (
        <SelectItem key={items.value} textValue={items.value}>
          <Chips> {items.label} </Chips>
        </SelectItem>
      )}
    </Selects>
  );
}

interface SelectionContainerProps {
  data: Array<string>;
  label: string;
  create?: boolean;
  reloaddata?: () => void;
  onSelect?: (val: string[]) => void;
  value?: string[];
  customCreateFunction?: (
    name: Array<string>,
    func: () => void
  ) => Promise<void>;
  single?: boolean;
  onDelete?: (val: string) => Promise<void>;
}

export function SelectionContainer({
  data,
  label,
  create,
  reloaddata,
  onSelect,
  value,
  customCreateFunction,
  single,
  onDelete,
}: SelectionContainerProps) {
  const [selectvalue, setselectvalue] = React.useState(new Set(value ?? [""]));
  const [isNew, setisNew] = React.useState<Array<string> | undefined>();
  const [editidx, seteditidx] = React.useState<number | undefined>();
  const [loading, setloading] = React.useState(false);
  const [isEdit, setisEdit] = React.useState(false);
  const [textvalue, settextvalue] = React.useState("");
  const { ErrorToast } = useShowToast();
  const handleClick = (idx: number) => {
    const updatedSet = new Set(selectvalue);
    const value = data[idx];
    if (single) {
      if (updatedSet.has(value)) updatedSet.delete(value);
      else {
        updatedSet.clear();
        updatedSet.add(value);
      }
    } else {
      if (updatedSet.has(value)) updatedSet.delete(value);
      else updatedSet.add(value);
    }
    setselectvalue(updatedSet);
    if (onSelect) {
      onSelect(Array.from(updatedSet));
    }
  };
  const handleSave = async () => {
    setloading(true);

    const savereq = await ApiRequest({
      url: "/librarian/createcategory",
      method: "POST",
      cookies: true,
      data: {
        data: isNew,
      },
    });
    setloading(false);

    if (!savereq.success) {
      ErrorToast("Can't Save");
      return;
    }

    if (reloaddata) {
      reloaddata();
    }
    seteditidx(undefined);
    setisNew(undefined);
  };

  const handleEditClick = async (name: string) => {
    if (isEdit && onDelete) {
      await onDelete(name);
    } else {
      setisEdit(false);
    }
  };
  return (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-y-3 border border-gray-300 p-1 rounded-lg">
      <div className="w-full flex flex-row items-center">
        <p className="font-bold text-xl">{label}</p>
        <Button
          onClick={() => {
            if (isEdit === false) {
              ErrorToast("Delete Faculty Will Delete Department as well!!", {
                duration: 2000,
              });
            }

            setisEdit(!isEdit);
          }}
          variant="light"
          color="primary"
        >
          {isEdit ? "Done" : "Edit"}
        </Button>
      </div>

      <div className="selectioncontainer w-full h-fit flex flex-row items-start justify-start gap-x-3 flex-wrap gap-y-5">
        {data.map((item, idx) => {
          return (
            <Badge
              key={`Badge${idx}`}
              isInvisible={!isEdit}
              onClick={() => {
                handleEditClick(item);
              }}
              color="danger"
              content="—"
            >
              <div
                className={`${
                  selectvalue.has(item) ? "bg-blue-400" : "bg-gray-300"
                } rounded-lg cursor-pointer  max-w-[200px] h-fit  w-fit break-all p-2 text-sm`}
                onClick={() => handleClick(idx)}
                key={idx}
              >
                {item}
              </div>
            </Badge>
          );
        })}
        {isNew?.map((item, idx) => {
          return (
            <Badge
              isInvisible={!isEdit}
              onClick={() => {
                const updatearr = [...isNew];
                updatearr.splice(idx, 1);
                setisNew(updatearr);
                settextvalue("");
              }}
              color="danger"
              content="—"
              key={`badge${idx}`}
            >
              <div
                className="bg-gray-300 rounded-lg cursor-pointer  max-w-[200px] h-fit  w-fit break-all p-2 text-sm"
                onClick={() => {
                  seteditidx(idx);
                  settextvalue(isNew[idx]);
                }}
                key={idx}
              >
                {item}
              </div>
            </Badge>
          );
        })}
        {create && (
          <>
            <Chip
              onClick={() => {
                setisNew((prev) => [...(prev ?? []), ""]);
              }}
              className="bg-[#192A56] text-white font-bold transition-colors hover:bg-white cursor-pointer mt-2"
            >
              New
            </Chip>
          </>
        )}
      </div>
      {isNew && (
        <>
          <Input
            type="text"
            size="sm"
            variant="bordered"
            label="Name"
            value={textvalue}
            onChange={({ target }) => {
              settextvalue(target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const updatedarr = [...isNew];
                const idx = editidx ?? isNew.length - 1;
                updatedarr[idx] = textvalue;
                setisNew(updatedarr);
                settextvalue("");
                seteditidx(undefined);
              }
            }}
          />
          <div className="w-full h-fit flex flex-row gap-x-3">
            <Button
              isDisabled={isNew.length === 0 || isNew.some((i) => i === "")}
              size="sm"
              isLoading={loading}
              onClick={() =>
                customCreateFunction
                  ? customCreateFunction(isNew, () => setisNew(undefined))
                  : handleSave()
              }
              color="success"
              className="text-white font-bold"
            >
              Save
            </Button>
            <Button
              size="sm"
              isLoading={loading}
              onClick={() => {
                setisNew(undefined);
                seteditidx(undefined);
              }}
              color="danger"
              className="text-white font-bold"
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
