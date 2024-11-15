import { useEffect, useState } from "react";
import "../../style/style.css";
import { useGlobalContext } from "../../types/context.type";
import { BookStatus, BorrowBookType } from "../../types/book.type";
import { ROLE, UserType } from "../../types/user.type";
import { ApiRequest } from "../../utilities/helper";
import { useLoaderData } from "react-router-dom";
import TableData from "../Table/TableData";
import { SelectionDataType } from "../../types/helpertype.type";
import ResponsiveShowDataModal from "../Modals/Detail.modal";
import AlertDialog, { ImageModal } from "../Modals/Alert.modal";
import { Button } from "@nextui-org/react";
import { UserOfBookModal } from "../Table/TableModal";

const BorrowBookFilterStatusOption: Array<SelectionDataType> = Object.values(
  BookStatus
)
  .filter(
    (i) =>
      !i.includes(BookStatus.AVAILABLE) && !i.includes(BookStatus.UNAVAILABLE)
  )
  .map((i) => ({ label: i, value: i }));

const ModalContainer = ({ reloaddata }: { reloaddata: () => void }) => {
  const {
    openmodal,
    globalindex,
    setopenmodal,
    datatable_select,
    setglobalindex,
    globalstatestring,
    setglobalstatestring,
  } = useGlobalContext();
  const handleDelete = async () =>
    await ApiRequest({
      url: "/librarian/d-bb",
      method: "DELETE",
      cookies: true,
      data: {
        id: Array.from(datatable_select),
      },
    });

  return (
    <>
      {(openmodal.detailModal ||
        openmodal["returnbook"] ||
        openmodal["detailbook"]) && (
        <ResponsiveShowDataModal
          type={
            openmodal["detailbook"]
              ? "book"
              : openmodal.detailModal
              ? "borrowedbook"
              : "scanborrowedbook"
          }
          fetchid={globalindex}
          open={
            openmodal["detailbook"] ??
            openmodal.detailModal ??
            openmodal["returnbook"] ??
            false
          }
          close={() => {
            setglobalindex(-1);
            setopenmodal({});
          }}
        />
      )}
      {openmodal.deleteModal && (
        <AlertDialog
          description="Selected Borrow Data Will Be Delete"
          onAgree={() => handleDelete()}
          onDelete={() => reloaddata()}
        />
      )}
      {globalstatestring && (
        <>
          {openmodal.imageModal && (
            <ImageModal
              url={globalstatestring}
              close={() => {
                setglobalstatestring("");
              }}
            />
          )}
        </>
      )}
      {openmodal.userModal && <UserOfBookModal />}
    </>
  );
};
const ListofBorrowedbook = () => {
  const user = useLoaderData() as UserType;
  const {
    page,
    limit,
    filterdata,
    setloading,
    datatable_select,
    setopenmodal,
    setselect,
  } = useGlobalContext();
  const [totalborrowbook, settotal] = useState(0);
  const [reloaddata, setreloaddata] = useState(true);
  const [borrowedbook, setborrowed] = useState<Array<BorrowBookType>>([]);

  useEffect(() => {
    const getBorrowBook = async () => {
      const url = `${`/${
        user.role === ROLE.LIBRARIAN ? "librarian" : "user"
      }/getborrowbook?type=${user.role}&p=${page}&lt=${limit}`}${
        filterdata.search ? `&search=${filterdata.search}` : ""
      }${
        filterdata.status ? `&status=${filterdata.status}` : ""
      }&detailtype=book`;
      setloading(true);
      const response = await ApiRequest({ url, method: "GET", cookies: true });
      setloading(false);
      setborrowed(response.data as BorrowBookType[]);
      settotal(response.totalcount as number);
      setreloaddata(false);
    };
    if (reloaddata || filterdata.search || filterdata.status) getBorrowBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterdata.status,
    filterdata.search,
    limit,
    page,
    reloaddata,
    user?.role,
  ]);

  return (
    <>
      {
        <ModalContainer
          reloaddata={() => {
            setreloaddata(true);
            setselect(new Set([]));
          }}
        />
      }
      <div className="borrowedbook_container">
        <h1 className="titlepage font-black border-b-4 border-[#4682B4] p-2">
          List of Borrowed Book
        </h1>

        <div className="btn_container w-full h-fit flex flex-row items-center justify-start mb-10">
          {datatable_select.size > 0 && (
            <Button
              className="max-w-md h-[40px] font-bold rounded-none"
              color="danger"
              variant="flat"
              onClick={() => setopenmodal({ deleteModal: true })}
            >
              Delete {datatable_select.size}
            </Button>
          )}
        </div>
        <div className="table_container">
          <TableData
            type={"borrowedbook"}
            tabledata={borrowedbook as never}
            filterstatusoption={BorrowBookFilterStatusOption}
            reloaddata={() => setreloaddata(true)}
            onSearch={() => setreloaddata(true)}
            totaldata={totalborrowbook}
            totalpage={Math.ceil(totalborrowbook / limit)}
            isUser={user?.role === ROLE.STUDENT}
          />
        </div>
      </div>
    </>
  );
};

export default ListofBorrowedbook;
