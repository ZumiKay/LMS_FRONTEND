import React, { ReactNode, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  User,
  Chip,
  ChipProps,
  getKeyValue,
  Input,
} from "@nextui-org/react";
import { useGlobalContext } from "../../types/context.type";
import { TableColumnType, tabletype } from "./TableData.type";
import { SearchIcon, VerticalDotsIcon } from "../../assets/SvgComponent";
import { UserType } from "../../types/user.type";
import { BookType, BorrowBookType } from "../../types/book.type";
import ResponsiveShowDataModal from "../Modals/Detail.modal";
import { MuitpleSelection } from "../Selection";
import { SelectionDataType } from "../../types/helpertype.type";
import { normalizeString } from "../../utilities/helper";

interface TabelDataProps {
  type: tabletype;
  tabledata: Array<{ [key: string]: never }>;
  totalpage: number;
  totaldata: number;
  reloaddata?: () => void;
  onSearch?: () => Promise<void> | void;
  filterstatus?: Set<string>;
  filterstatusoption?: Array<SelectionDataType>;
  setfilterstatus?: React.Dispatch<React.SetStateAction<Set<string>>>;
  AdditionalFilterComponent?: ReactNode;
  isUser?: boolean;
}

const bookcolumn: Array<TableColumnType> = [
  {
    name: "ID",
    uid: "id",
    sortable: true,
  },
  {
    name: "ISBN",
    uid: "ISBN",
  },
  { name: "TITLE", uid: "title", sortable: true },
  { name: "STATUS", uid: "status" },
  { name: "BORROWED", uid: "borrow_count", sortable: true },
  { name: "ACTION", uid: "actions" },
];
const usercolumn: Array<TableColumnType> = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "ROLE", uid: "role" },
  { name: "Entry", uid: "entries" },
  { name: "BorrowedBook", uid: "borrowbooks" },
  { name: "ACTION", uid: "actions" },
];
const borrowedbookcolumn: Array<TableColumnType> = [
  { name: "ID", uid: "id", sortable: true },
  { name: "BORROWID", uid: "borrow_id" },
  { name: "BORROWDATE", uid: "createdAt" },
  { name: "QRCODE", uid: "qrcode" },
  { name: "STATUS", uid: "status" },
  { name: "BOOK", uid: "book" },
];

const ShowPerRowOption = ["5", "15", "25", "35", "45", "50"];

const statusColorMap: Record<string, ChipProps["color"]> = {
  Available: "success",
  Unavailable: "danger",
  ToPickUp: "primary",
  PICKEDUP: "warning",
  RETURNED: "success",
};

export default function TableData({
  type,
  tabledata,
  totalpage,
  totaldata,
  reloaddata,
  onSearch,
  filterstatusoption,
  AdditionalFilterComponent,
  isUser,
}: TabelDataProps) {
  const {
    loading,
    setopenmodal,
    setpage,
    setlimit,
    page,
    limit,
    setselect,
    datatable_select,
    setfilterdata,
    filterdata,
    setglobalindex,
    setglobalstatestring,
  } = useGlobalContext();
  const [index, setindex] = useState(-1);

  const ColumnHeader = React.useCallback(() => {
    return type === "booklist"
      ? bookcolumn
      : type === "borrowedbook"
      ? isUser
        ? borrowedbookcolumn
        : [...borrowedbookcolumn, { name: "USER", uid: "user" }]
      : usercolumn;
  }, [isUser, type]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setlimit(Number(e.target.value));
      setpage(1);
      if (reloaddata) reloaddata();
    },
    [reloaddata, setlimit, setpage]
  );

  const renderTableData = React.useCallback(
    ({
      data,
      Key,
      idx,
    }: {
      data: UserType | BookType | BorrowBookType | string;
      Key: string;
      idx: number;
    }) => {
      const handleClickView = (indexstring: string, idx: number) => {
        setindex(idx);
        setopenmodal({ [indexstring]: true });
      };

      switch (Key) {
        case "id":
          return <p>{idx}</p>;

        case "name":
          if (type === "userlist") {
            const val = data as UserType;
            return (
              <User
                classNames={{
                  description: "text-default-500",
                }}
                description={val.email}
                name={val.fullname}
              >
                {val.email}
              </User>
            );
          }
          break;

        case "title":
          if (type === "booklist") {
            const val = data as BookType;
            return (
              <div className="w-full h-fit flex flex-row items-center gap-x-5">
                {val.cover_img && (
                  <img
                    src={val.cover_img}
                    alt="bookcover"
                    className="w-[100px] h-[150px] object-cover"
                  />
                )}
                <div className="w-fit h-fit flex flex-col gap-y-3 font-bold">
                  <p>Title: {val.title}</p>
                  <p className="w-full flex flex-row items-center flex-wrap gap-x-3">
                    Author:{" "}
                    {val.author.map((i, idx) => (
                      <>
                        <span>
                          {i} {idx === val.author.length - 1 ? "" : ` -> `}
                        </span>
                      </>
                    ))}
                  </p>
                  <p>
                    Categroy: {val.categories.map((i) => i.name).join(` | `)}
                  </p>
                </div>
              </div>
            );
          }
          break;

        case "ISBN":
          if (type === "booklist") {
            const val = data as BookType;
            return (
              <div className="flex flex-col items-start gap-y-3 font-bold">
                {val.ISBN.map((item, idx) => (
                  <p key={idx}>
                    {item.type}: {item.identifier}
                  </p>
                ))}
              </div>
            );
          }
          break;

        case "role":
          if (type === "userlist") {
            const val = data as UserType;
            return (
              <div className="flex flex-col">
                <p className="text-bold text-small capitalize">{val.role}</p>
                {val.department && (
                  <p className="text-bold text-tiny capitalize text-default-500">
                    {val.department?.department}
                  </p>
                )}
              </div>
            );
          }
          break;

        case "entries":
        case "borrowbooks":
          if (type === "userlist") {
            const { id } = data as UserType;
            return (
              <Button
                onClick={() =>
                  handleClickView(
                    Key === "entries" ? `entry${id}` : `borrowedbook${id}`,
                    id as number
                  )
                }
                className="font-bold"
                color="primary"
                variant="flat"
              >
                View
              </Button>
            );
          }
          break;

        case "status": {
          const val = data as BookType;
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={statusColorMap[val.status]}
              size="md"
              variant="dot"
            >
              {val.status}
            </Chip>
          );
        }
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown className="bg-background border-1 border-default-200">
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      setglobalindex(idx);
                      setselect(new Set([]));
                      setopenmodal({ register: true });
                    }}
                  >
                    Edit
                  </DropdownItem>

                  <DropdownItem
                    onClick={() => {
                      setglobalindex(idx);
                      setselect(new Set([]));
                      setopenmodal({ deleteModal: true });
                    }}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );

        case "qrcode": {
          const val = data as BorrowBookType;
          return val.qrcode ? (
            <img
              onClick={() => {
                setglobalstatestring(val.qrcode);
                setopenmodal({ imageModal: true });
              }}
              className="w-[150px] h-[150px]"
              alt="qrcode"
              src={val.qrcode}
            />
          ) : (
            <></>
          );
        }

        case "book": {
          const val = data as BorrowBookType;
          return (
            <Button
              onClick={() => {
                setglobalindex(val.id as number);
                setopenmodal({ detailbook: true });
              }}
              variant="bordered"
              color="primary"
              className="max-w-md"
            >
              View
            </Button>
          );
        }

        case "user": {
          const val = data as BorrowBookType;
          return (
            <Button
              onClick={() => {
                setglobalindex(val.id as number);
                setopenmodal({ userModal: true });
              }}
              className="max-w-md"
              color="primary"
            >
              View
            </Button>
          );
        }
        default:
          return <p className="font-bold"> {getKeyValue(data, Key)} </p>;
      }
    },
    [setglobalindex, setglobalstatestring, setopenmodal, setselect, type]
  );

  const RowPerPageSelect = React.useCallback(() => {
    return (
      <div className="flex justify-between items-center">
        <span className="text-default-800 text-small">Total: {totaldata}</span>

        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
            value={limit}
          >
            {ShowPerRowOption.map((i) => (
              <option value={i}>{i}</option>
            ))}
          </select>
        </label>
      </div>
    );
  }, [limit, onRowsPerPageChange, totaldata]);
  return (
    <>
      <ModalContainer index={index} close={() => setindex(-1)} />
      <Table
        isHeaderSticky
        aria-label="Controlled table example with dynamic content"
        showSelectionCheckboxes={isUser ? false : true}
        topContent={
          <>
            <RowPerPageSelect />{" "}
            <div className="w-full h-fit flex flex-row items-center justify-between">
              {onSearch && (
                <Input
                  className="max-w-md"
                  size="md"
                  startContent={<SearchIcon />}
                  placeholder={
                    "Search " +
                    (type === "booklist"
                      ? ` ISBN, title, category, author`
                      : "")
                  }
                  value={filterdata.search}
                  onChange={({ target }) =>
                    setfilterdata((prev) => ({
                      ...prev,
                      search: normalizeString(target.value),
                    }))
                  }
                  onBlur={() => onSearch()}
                  onKeyDown={(val) => {
                    if (val.key === "Enter") {
                      onSearch();
                    }
                  }}
                />
              )}
              {AdditionalFilterComponent && AdditionalFilterComponent}
              {filterstatusoption && (
                <MuitpleSelection
                  data={filterstatusoption}
                  label="Status"
                  onSelect={(val) => {
                    setfilterdata((prev) => ({
                      ...prev,
                      status: val.filter((i) => i !== ""),
                    }));
                  }}
                />
              )}
            </div>
          </>
        }
        selectionMode={isUser ? "none" : "multiple"}
        selectedKeys={datatable_select}
        onSelectionChange={setselect as never}
        bottomContent={
          totalpage > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={totalpage}
                onChange={(page) => {
                  if (reloaddata) reloaddata();
                  setpage(page);
                }}
              />
            </div>
          ) : null
        }
      >
        <TableHeader columns={ColumnHeader()}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={tabledata ?? []}
          emptyContent={
            type === "borrowedbook" ? "No Borrowed Book" : "No Data Found"
          }
          loadingContent={<Spinner />}
          loadingState={loading ? "loading" : "idle"}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell key={columnKey}>
                  {renderTableData({
                    data: item as never,
                    Key: columnKey as string,
                    idx: item.id,
                  })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

const ModalContainer = ({
  index,
  close,
}: {
  index: number;
  close: () => void;
}) => {
  const { openmodal, setopenmodal } = useGlobalContext();
  const indexstring =
    openmodal[`entry${index}`] || openmodal[`borrowedbook${index}`];
  return (
    <>
      {indexstring && (
        <ResponsiveShowDataModal
          fetchid={index}
          open={indexstring}
          close={() => {
            close();
            setopenmodal({});
          }}
          type={openmodal[`entry${index}`] ? "entry" : "borrowedbook"}
        />
      )}
    </>
  );
};
