import {
  Button,
  Chip,
  DateRangePicker,
  getKeyValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { ApiRequest, formatDateToMMDDYYYYHHMMSS } from "../../utilities/helper";
import { LibraryEntryType, UserType } from "../../types/user.type";
import {
  BookType,
  BorrowBookType,
  FilterTableDataType,
} from "../../types/book.type";
import { TableColumnType } from "./TableData.type";
import { SearchIcon } from "../../assets/SvgComponent";
import { useGlobalContext } from "../../types/context.type";

interface ModalTableProps {
  type: "entry" | "borrowedbook";
  fetchid: number;
}
const rowsPerPage = 10;

const EntryColumn: Array<TableColumnType> = [
  { name: "ID", uid: "id" },
  { name: "ENTRY DATE", uid: "createdAt" },
];
const BorrowedBookColumn: Array<TableColumnType> = [
  { name: "ID", uid: "borrow_id" },
  { name: "BORROW DATE", uid: "createdAt" },
  { name: "STATUS", uid: "status" },
  { name: "EXPECT RETURN DATE", uid: "expect_return_date" },
];
export function ModalTable({ type, fetchid }: ModalTableProps) {
  const [page, setPage] = useState(1);
  const [entrydata, setentrydata] = useState<LibraryEntryType[]>();
  const [borrowedbookdata, setborroweddata] = useState<BorrowBookType[]>();
  const [totaldata, settotaldata] = useState(0);
  const [loading, setloading] = useState(false);
  const [filterdata, setfilterdata] = useState<FilterTableDataType>();

  useEffect(() => {
    const getData = async () => {
      const url = `/librarian/getstudent?ty=${
        type === "entry" ? `entry` : "borrowedbook"
      }&id=${fetchid}&page=${page}&limit=${rowsPerPage}${
        filterdata?.search ? `&search=${filterdata.search}` : ""
      }${
        filterdata?.daterange
          ? `&startdate=${filterdata.daterange.start}&endstart=${filterdata.daterange.end}`
          : ""
      }`;
      setloading(true);
      const response = await ApiRequest({ url, method: "GET", cookies: true });
      setloading(false);
      if (response.success) {
        if (type === "entry") setentrydata(response.data as LibraryEntryType[]);
        else setborroweddata(response.data as BorrowBookType[]);

        settotaldata(response.totalcount ?? 0);
      }
    };
    getData();
  }, [fetchid, filterdata?.daterange, filterdata?.search, page, type]);

  const FilterContainer = () => {
    return (
      <div className="w-fit h-fit flex flex-col gap-y-5">
        {filterdata && (
          <Button
            onClick={() => {
              setfilterdata(undefined);
            }}
            size="md"
            color="primary"
            variant="solid"
          >
            Clear Filter
          </Button>
        )}
        <DateRangePicker
          label="Date range"
          size="lg"
          value={filterdata?.daterange}
          onChange={(val) => {
            setfilterdata((prev) => ({ ...(prev ?? {}), daterange: val }));
          }}
        />
        {type === "borrowedbook" && (
          <>
            <Input
              variant="bordered"
              placeholder="Search Book Title, BorrowID"
              value={filterdata?.search}
              endContent={
                <div>
                  <SearchIcon />
                </div>
              }
              onChange={(val) => {
                setfilterdata((prev) => ({
                  ...(prev ?? {}),
                  search: val.target.value,
                }));
              }}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <Table
        aria-label="Example table with client async pagination"
        isHeaderSticky
        fullWidth
        topContent={<FilterContainer />}
        bottomContent={
          totaldata > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={Math.ceil(totaldata / rowsPerPage)}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader
          columns={type === "entry" ? EntryColumn : BorrowedBookColumn}
        >
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>

        {type === "borrowedbook" ? (
          <TableBody
            loadingContent={<Spinner />}
            loadingState={loading ? "loading" : "idle"}
            items={borrowedbookdata ?? []}
            emptyContent="No Data Found"
          >
            {(item) => (
              <TableRow key={item?.id}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        ) : (
          <TableBody
            loadingContent={<Spinner />}
            loadingState={loading ? "loading" : "idle"}
            items={entrydata ?? []}
            emptyContent="No Data Found"
          >
            {(item) => (
              <TableRow key={item?.id}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
    </>
  );
}

const ListOfBookColumn: Array<TableColumnType> = [
  { name: "BOOK", uid: "book" },
  { name: "STATUS", uid: "status" },
];
export function ListOfBookTable() {
  const { globalindex } = useGlobalContext();
  const [data, setdata] = useState<Array<BookType>>();
  const [loading, setloading] = useState(false);

  useEffect(() => {
    async function getbook() {
      setloading(true);
      const getreq = await ApiRequest({
        url: `/user/getborrowdetail?borrowid=${globalindex}&ty=book`,
        method: "GET",
        cookies: true,
      });
      setloading(false);

      if (getreq.success) {
        setdata(getreq.data as Array<BookType>);
      }
    }

    if (globalindex !== -1) getbook();
  }, [globalindex]);

  const RenderTableCell = useCallback((uid: string, data: BookType) => {
    switch (uid) {
      case "book": {
        return (
          <div className="w-full h-fit flex flex-row items-center gap-x-5">
            {data.cover_img && (
              <img
                src={data.cover_img}
                alt="bookcover"
                className="w-[100px] h-[150px] object-cover"
              />
            )}
            <div className="w-fit h-fit flex flex-col gap-y-3 font-bold">
              <p>Title: {data.title}</p>
              <p className="w-full flex flex-row items-center flex-wrap gap-x-3">
                Author:{" "}
                {data.author?.map((i, idx) => (
                  <>
                    <span>
                      {i} {idx === data.author.length - 1 ? "" : ` -> `}
                    </span>
                  </>
                ))}
              </p>
              <p>Categroy: {data.categories?.map((i) => i.name).join(` | `)}</p>
              <div className="flex flex-col items-start gap-y-3 font-bold">
                <p className="font-black flex flex-row gap-x-5 flex-wrap">
                  ISBN:
                  {data.ISBN?.map((i) => (
                    <span key={i.identifier}>
                      {i.type}:{i.identifier}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        );
      }

      case "status": {
        return (
          <Chip variant="solid" color="default">
            {data.BookBucket?.returndate
              ? `Returned At ${formatDateToMMDDYYYYHHMMSS(
                  data.BookBucket.returndate
                )}`
              : "Not Return"}
          </Chip>
        );
      }
      default:
        return <p>{JSON.stringify(data)}</p>;
    }
  }, []);
  return (
    <Table
      aria-label="Example table with client async pagination"
      isHeaderSticky
      fullWidth
    >
      <TableHeader onClick={() => console.log(data)} columns={ListOfBookColumn}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>

      <TableBody
        loadingContent={<Spinner />}
        loadingState={loading ? "loading" : "idle"}
        emptyContent="No Data Found"
        items={data ?? []}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(rowkey) => (
              <TableCell key={rowkey}>
                {RenderTableCell(rowkey as string, item)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export function UserOfBookModal() {
  const { openmodal, setopenmodal, globalindex, setglobalindex } =
    useGlobalContext();
  const [data, setdata] = useState<UserType>();

  useEffect(() => {
    async function getdata() {
      const getreq = await ApiRequest({
        url: `/user/getborrowdetail?borrowid=${globalindex}&ty=user`,
        method: "GET",
        cookies: true,
      });

      if (getreq.success) {
        setdata(getreq.data as UserType);
      }
    }

    if (globalindex !== -1) getdata();
  }, [globalindex]);

  return (
    <Modal
      onOpenChange={(val) => setopenmodal({ userModal: val })}
      isOpen={openmodal.userModal ?? false}
      onClose={() => setglobalindex(-1)}
      placement="top"
      size="md"
      closeButton
    >
      <ModalContent>
        <ModalBody>
          <div className="w-full h-fit flex flex-col gap-y-10 text-lg font-bold">
            <p>Name: {`${data?.firstname} ${data?.lastname}`}</p>
            <a
              className="text-lg text-black font-bold"
              href={"mailto:" + data?.email}
            >
              Email: {data?.email}
            </a>
            <p>ID: {data?.studentID}</p>
            <p>Faculty: {data?.department?.faculty?.name}</p>
            <p>Department: {data?.department?.department}</p>
            <p>Phonenumber: {data?.phone_number ?? "No Number"}</p>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
