import { useEffect, useState } from "react";
import "../../style/style.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ApiRequest } from "../../utilities/helper";
import { BookBucketType, BorrowBookType } from "../../types/book.type";
import AlertDialog from "../Modals/Alert.modal";
import { useGlobalContext } from "../../types/context.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@nextui-org/react";
import { useShowToast } from "../../config/customHook";

const handleDeleteBuckets = async (id: string) =>
  await ApiRequest({
    url: "/deletebucket",
    method: "DELETE",
    cookies: true,
    data: { bucketId: parseInt(id as string, 10), ty: true },
  });

const CheckoutPage = () => {
  const { id } = useParams();
  const {
    loading: fetchloading,
    setloading: setfetchloading,
    setcartcount,
  } = useGlobalContext();
  const [checked, setchecked] = useState(false);
  const { SuccessToast } = useShowToast();
  const [reloaddata, setreloaddata] = useState(true);
  const [bucketdata, setbucketdata] = useState<BookBucketType>();
  const [borrowbook, setborrowbook] = useState<BorrowBookType>();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setfetchloading(true);
    const checkoutreq = await ApiRequest({
      url: "/checkout",
      method: "POST",
      data: {
        bucketId: bucketdata?.id,
      },
      cookies: true,
    });
    setfetchloading(false);

    if (!checkoutreq.success) {
      toast.error("Can't Checkout");
      return;
    }

    setborrowbook(checkoutreq.data as BorrowBookType);
    setcartcount(0);
    setchecked(true);
  };

  const handledelete = async (bookId: number) => {
    //Delete Cart Item

    setfetchloading(true);
    const deletereq = await ApiRequest({
      url: "/deletebucket",
      method: "DELETE",
      data: { bookId: [bookId], bucketId: bucketdata?.id },
      cookies: true,
    });
    setfetchloading(false);

    if (!deletereq.success) {
      toast.error("Can't Removed");
      return;
    }

    SuccessToast("Removed");
    setcartcount((prev) => (prev > 0 ? prev - 1 : 0));
    setreloaddata(true);
  };

  useEffect(() => {
    const getBucketInfo = async () => {
      setfetchloading(true);
      const response = await ApiRequest({
        url: "/getbucket",
        method: "GET",
        cookies: true,
      });
      setfetchloading(false);
      if (response.success) {
        const data = response.data as BookBucketType;
        setbucketdata(data);
      } else {
        setbucketdata(undefined);
      }
      setreloaddata(false);
    };

    if (reloaddata) getBucketInfo();
  }, [reloaddata]);

  return (
    <>
      <AlertDialog onAgree={() => handleDeleteBuckets(id as string)} />
      <div className="checkout_container min-h-screen h-full">
        <h1 className="text-4xl font-black">BOOK BUCKET</h1>

        {!fetchloading && !bucketdata && (
          <>
            <p className="text-red-500 font-bold">No Book In Bucket</p>
            <FontAwesomeIcon icon={faBookOpen} fontSize={50} />
            <Button
              onClick={() => navigate("/")}
              variant="bordered"
              color="primary"
              className="font-bold"
            >
              Explore Book
            </Button>
          </>
        )}

        {bucketdata && (
          <div className="book_container">
            {!checked
              ? bucketdata.books.map((book) => (
                  <div className="book">
                    <img
                      onClick={() => navigate(`/book/${book.id}`)}
                      src={book.cover_img}
                      alt="cover"
                      className="book_cover"
                    />
                    <div className="book_detail">
                      <p>{book.title}</p>
                      <p>ISBN: {book.ISBN[0].identifier}</p>
                      <p>{book.categories.map((i) => i.name).join(` | `)}</p>
                    </div>
                    <div onClick={() => handledelete(book.id as number)}>
                      <FontAwesomeIcon icon={faTrash} fontSize={17} />
                    </div>
                  </div>
                ))
              : borrowbook && (
                  <div className="checked_container">
                    <p className="text-3xl font-bold text-green-500">
                      CHECKOUT COMPLETE
                    </p>
                    <p className="text-xl font-bold">
                      BORROWID: {borrowbook.borrow_id}{" "}
                    </p>
                    <p className="text-xl font-medium text-red-400">
                      Please take screenshot of the this section for pickup.
                    </p>
                    <p className="text-xl font-medium text-red-400">
                      QR Code will expire in 24h
                    </p>
                    <img
                      className="qrcode"
                      src={borrowbook.qrcode}
                      alt="qrcode"
                      loading="eager"
                    />
                    <Button
                      color="primary"
                      variant="bordered"
                      className="max-w-md"
                      onClick={() =>
                        navigate("/borrowedbook", { replace: true })
                      }
                      size="md"
                    >
                      View Order
                    </Button>
                  </div>
                )}
          </div>
        )}
        {!checked && bucketdata && (
          <div className="btn_sec">
            <button
              onClick={() => {
                console.log("Delete All Bucket");
              }}
              className="btn btn-red"
            >
              CANCEL
            </button>
            <button onClick={() => handleCheckout()} className="btn">
              CHECKOUT
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CheckoutPage;
