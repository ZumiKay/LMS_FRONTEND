import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ApiRequest, formatDateToMMDDYYYYHHMMSS } from "../../utilities/helper";
import React, { useState } from "react";
import { UserType } from "../../types/user.type";
import { BookStatus, BookType, BorrowBookType } from "../../types/book.type";
import { ListOfBookTable, ModalTable } from "../Table/TableModal";
import { Button, Chip, Progress } from "@nextui-org/react";
import { useShowToast } from "../../config/customHook";

interface ResponsiveDialogType {
  open: boolean;
  type?: "entry" | "borrowedbook" | "scanentry" | "scanborrowedbook" | "book";
  fetchid?: number;
  data?: UserType | BorrowBookType | Array<BookType>;
  setscan?: (val: boolean) => void;
  close: () => void;
  reloaddata?: () => void;
}

export default function ResponsiveShowDataModal(props: ResponsiveDialogType) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setloading] = useState(false);

  const handleClose = () => {
    props.close();
    if (props.setscan) props.setscan(false);
  };

  const UserInformation = React.useCallback(() => {
    const userdata = props.data as UserType;
    return (
      <>
        {userdata?.profile && (
          <img src={userdata?.profile} className="student_img" alt="profile" />
        )}
        <table className="studentDetail_table">
          <tr>
            <th>Student ID</th>
            <td>{userdata?.studentID}</td>
          </tr>
          <tr>
            <th>Student Name</th>
            <td>{`${userdata.firstname} ${userdata.lastname}`}</td>
          </tr>
          <tr>
            <th>Faculty</th>
            <td>{userdata?.department?.faculty?.name}</td>
          </tr>
          <tr>
            <th>Department</th>
            <td>{userdata?.department?.department}</td>
          </tr>
          <tr>
            <th></th>
          </tr>
        </table>
      </>
    );
  }, [props.data]);

  return (
    <Dialog
      fullScreen={
        props.type === "scanentry" || props.type === "scanborrowedbook"
          ? fullScreen
          : true
      }
      open={props.open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {props.type === "entry" ? "Student Detail" : "Borrow Detail"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="student_modal">
          <>
            {loading && (
              <Progress
                size="sm"
                isIndeterminate
                aria-label="Loading..."
                className="max-w-full"
              />
            )}
            {props.type === "scanentry" ? (
              <UserInformation />
            ) : props.type === "scanborrowedbook" ? (
              <>
                <BorrowBookTable
                  borrowbookdata={props.data as BorrowBookType}
                  reloaddata={props.reloaddata}
                  setloading={setloading}
                />
              </>
            ) : props.type === "book" ? (
              <ListOfBookTable />
            ) : (
              props.fetchid && (
                <ModalTable
                  type={props.type as never}
                  fetchid={props.fetchid}
                />
              )
            )}
          </>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const BorrowBookTable = ({
  borrowbookdata,
  reloaddata,
  setloading,
}: {
  borrowbookdata: BorrowBookType;
  reloaddata?: () => void;
  setloading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const { ErrorToast, SuccessToast } = useShowToast();

  const handleIndividualBookReturn = async (id: number, bookId: number) => {
    setloading(true);
    const returnReq = await ApiRequest({
      url: "/librarian/manuallyreturn",
      method: "PUT",
      cookies: true,
      data: {
        borrowId: id,
        bookId,
      },
    });
    setloading(false);
    if (!returnReq.success) {
      ErrorToast("Error Occured");
      return;
    }
    SuccessToast("Returned");
    if (reloaddata) reloaddata();
  };

  const handleReturnAll = async (userid: string) => {
    setloading(true);
    const returnreq = await ApiRequest({
      url: "/librarian/handleborrowbook",
      method: "PUT",
      cookies: true,
      data: {
        borrowId: userid,
        type: "return",
      },
    });
    setloading(false);

    if (!returnreq.success) {
      ErrorToast(returnreq.message ?? "Error Occured");
      return;
    }
    SuccessToast("Returned");
    if (reloaddata) reloaddata();
  };

  const handlePickUp = async () => {
    setloading(true);
    const pickupreq = await ApiRequest({
      url: "/librarian/handleborrowbook",
      method: "PUT",
      cookies: true,
      data: {
        type: "pickup",
        borrowId: borrowbookdata.borrow_id,
      },
    });
    setloading(false);

    if (!pickupreq.success) {
      ErrorToast("Can't PickUp");
      return;
    }

    SuccessToast("Picked Up");
    if (reloaddata) reloaddata();
  };
  return (
    <table className="studentDetail_table">
      <tr>
        <th>Borrow ID</th>
        <td>{borrowbookdata.borrow_id}</td>
      </tr>
      <tr>
        <th>Borrow Date</th>
        <td>
          {formatDateToMMDDYYYYHHMMSS(new Date(borrowbookdata.createdAt))}
        </td>
      </tr>
      <tr>
        <th>Expect Return Date</th>
        <td>
          {borrowbookdata.expect_return_date
            ? formatDateToMMDDYYYYHHMMSS(
                new Date(borrowbookdata.expect_return_date)
              )
            : ""}
        </td>
      </tr>
      <tr>
        <th>Status</th>
        <td>
          <Chip variant="bordered" color="primary">
            {borrowbookdata.status}
          </Chip>
        </td>
      </tr>
      <tr>
        <th>Student</th>
        <td>
          {borrowbookdata.user?.firstname} {borrowbookdata.user?.lastname} (ID:{" "}
          {borrowbookdata.user?.studentID})
        </td>
      </tr>

      <tr>
        <th>All Books</th>
        {borrowbookdata.status !== BookStatus.TOPICKUP &&
          borrowbookdata.status !== BookStatus.RETURNED && (
            <th>
              <Button
                onClick={() =>
                  handleReturnAll(borrowbookdata.user?.studentID as string)
                }
              >
                Return All
              </Button>
            </th>
          )}

        {borrowbookdata.status === BookStatus.TOPICKUP && (
          <th>
            <Button
              color="warning"
              onClick={() => handlePickUp()}
              className="text-white font-bold"
            >
              Pick Up
            </Button>
          </th>
        )}
      </tr>
      <tr>
        <td className="book_row">
          {borrowbookdata.bucket?.books?.map((i) => (
            <div key={i.id} className="borrowed_book flex flex-col gap-y-5">
              <img
                onClick={() => navigate(`/book/${i.title}`)}
                src={i.cover_img}
                alt="cover"
              />
              <p className="text-lg font-black text-blue-500">{i.title}</p>
              <p>{i.categories.map((i) => i.name).join(` | `)}</p>
              <p className="w-full h-fit flex flex-row gap-x-5 flex-wrap">
                ISBN:
                {i.ISBN.map((i) => (
                  <span key={i.identifier}>
                    {i.type}:{i.identifier}
                  </span>
                ))}
              </p>
              {i.BookBucket?.returndate && (
                <p>
                  Return Date:{" "}
                  {formatDateToMMDDYYYYHHMMSS(
                    new Date(i.BookBucket.returndate)
                  )}
                </p>
              )}
              {borrowbookdata.status !== BookStatus.RETURNED &&
                borrowbookdata.status !== BookStatus.TOPICKUP && (
                  <>
                    {i.status === BookStatus.UNAVAILABLE ? (
                      <Button
                        onClick={() =>
                          handleIndividualBookReturn(
                            borrowbookdata.id as number,
                            i.id as number
                          )
                        }
                        className="max-w-md"
                        variant="flat"
                        color="primary"
                      >
                        Return
                      </Button>
                    ) : (
                      <Button
                        className="max-w-md"
                        color="default"
                        variant="bordered"
                      >
                        Returned
                      </Button>
                    )}
                  </>
                )}
            </div>
          ))}
        </td>
      </tr>
    </table>
  );
};
