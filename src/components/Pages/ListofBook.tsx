import { useEffect, useState } from "react";
import "../../style/style.css";
import { ApiRequest } from "../../utilities/helper";
import { BookStatus, BookType, CategoyType } from "../../types/book.type";
import { useGlobalContext } from "../../types/context.type";
import TableData from "../Table/TableData";
import CreateBook from "../Modals/Book.modal";
import { SelectionDataType } from "../../types/helpertype.type";
import AlertDialog from "../Modals/Alert.modal";
import { MuitpleSelection } from "../Selection";

const filterstatusoption: SelectionDataType[] = [
  { label: "Available", value: BookStatus.AVAILABLE },
  { label: "Unavailable", value: BookStatus.UNAVAILABLE },
];

const ListofBook = () => {
  const {
    datatable_select,
    setopenmodal,
    page,
    limit,
    filterdata,
    setfilterdata,
    setloading: setfetchloading,
  } = useGlobalContext();
  const [reloaddata, setreloaddata] = useState(true);
  const [bookdata, setbookdata] = useState<Array<BookType>>();
  const [totalbook, settotalbook] = useState(0);
  const [cate, setcate] = useState<Array<CategoyType>>();

  //fetch Book Data

  useEffect(() => {
    const getCate = async () => {
      const response = await ApiRequest({
        url: "/librarian/getcategory",
        method: "GET",
        cookies: true,
      });

      if (response.success) {
        setcate(response.data as Array<CategoyType>);
      }
    };
    getCate();
  }, []);
  useEffect(() => {
    const getBook = async () => {
      setfetchloading(true);
      const response = await ApiRequest({
        url: `/getallbook?type=all&page=${page}&limit=${limit}`,
        method: "GET",
      });
      setfetchloading(false);

      if (response.success) {
        setbookdata(response.data as Array<BookType>);
        settotalbook(response.totalcount ?? 0);
      }
      setreloaddata(false);
    };
    if (reloaddata && !filterdata.categories && !filterdata.status) {
      getBook();
    }
  }, [reloaddata, page, limit]);

  //Filter Status
  useEffect(() => {
    if (filterdata.status || filterdata.categories) {
      handleFilter();
    }
  }, [filterdata.status, filterdata.categories, page, limit]);

  const handleFilter = async () => {
    setfetchloading(true);
    const response = await ApiRequest({
      url: `/getallbook?type=${
        filterdata.search ||
        (filterdata.status && filterdata.status.length > 0) ||
        (filterdata.categories && filterdata.categories.length > 0)
          ? "filter"
          : "all"
      }${filterdata.status ? `&status=${filterdata.status.join(",")}` : ""}${
        filterdata.search ? `&search=${filterdata.search}` : ""
      }${
        filterdata.categories ? `&cates=${filterdata.categories.join(",")}` : ""
      }&page=${page}&limit=${limit}`,
      method: "GET",
    });
    setfetchloading(false);
    if (response.success) {
      setbookdata(response.data as Array<BookType>);
      settotalbook(response.totalcount as number);
    }
  };

  //Filter Book Data

  return (
    <>
      <ModalContianer reload={() => setreloaddata(true)} />
      <div className="booklist_container">
        <div className="header_sec">
          <h3 className="titlepage font-black border-b-4 border-[#4682B4] p-2 w-full">
            List of All Book
          </h3>
          <div className="headerbtn_sec">
            <button
              onClick={() => {
                setopenmodal({ register: true });
              }}
              className="header_btn"
            >
              REGISTER
            </button>
            {datatable_select.size > 0 && (
              <button
                className="header_btn header_btn-delete"
                onClick={() => setopenmodal({ deleteModal: true })}
              >
                DELETE
              </button>
            )}
          </div>
        </div>

        <div className="w-full h-fit">
          <TableData
            type="booklist"
            tabledata={bookdata as never}
            onSearch={() => handleFilter()}
            totalpage={Math.ceil(totalbook / limit)}
            totaldata={totalbook}
            reloaddata={() => setreloaddata(true)}
            filterstatusoption={filterstatusoption}
            AdditionalFilterComponent={
              <MuitpleSelection
                label="Category"
                data={
                  cate?.map((i) => ({
                    label: i.name,
                    value: i.name,
                  })) ?? []
                }
                value={filterdata.categories}
                onSelect={(val) =>
                  setfilterdata((prev) => ({
                    ...prev,
                    categories: val.filter((i) => i !== ""),
                  }))
                }
              />
            }
          />
        </div>
      </div>
    </>
  );
};

export default ListofBook;

const ModalContianer = ({ reload }: { reload: () => void }) => {
  const { openmodal, globalindex, datatable_select, setselect } =
    useGlobalContext();
  const deleteID =
    datatable_select.size > 0
      ? Array.from(datatable_select).map((i) => Number(i))
      : undefined;

  const handleDeleteBook = async () =>
    await ApiRequest({
      url: "/librarian/deletebook",
      method: "DELETE",
      cookies: true,
      data: {
        id: deleteID ?? [globalindex],
      },
    });
  return (
    <>
      {openmodal.register && (
        <CreateBook
          reload={() => reload()}
          editID={globalindex !== -1 ? globalindex : undefined}
        />
      )}
      {openmodal.deleteModal && (
        <AlertDialog
          description=" Selected book will be delete"
          onAgree={() => handleDeleteBook()}
          onDelete={() => {
            reload();
            if (deleteID) setselect(new Set([]));
          }}
        />
      )}
    </>
  );
};
