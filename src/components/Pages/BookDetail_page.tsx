import { useEffect, useState } from "react";
import "../../style/style.css";
import { useNavigate, useParams } from "react-router-dom";
import { BookStatus, BookType } from "../../types/book.type";
import { useJWTPayload } from "../../config/authentication";
import { ROLE } from "../../types/user.type";
import { ApiRequest, formatDateToMMDDYYYYHHMMSS } from "../../utilities/helper";
import toast from "react-hot-toast";
import { Button, Image } from "@nextui-org/react";
import { useGlobalContext } from "../../types/context.type";

const AddToBucketReq = async (bookIds: number[]) => {
  const response = await ApiRequest({
    url: "/addbucket",
    method: "POST",
    cookies: true,
    data: { bookIds },
  });

  if (!response.success) return null;

  return true;
};

const BookDetailPage = () => {
  const { user } = useJWTPayload();
  const { id } = useParams();
  const ctx = useGlobalContext();
  const [book, setbook] = useState<BookType>();
  const [reloaddata, setreloaddata] = useState(true);
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const asyncgetBookDetails = async () => {
      ctx.setloading(true);
      const response = await ApiRequest({
        url: `/getallbook?type=id&id=${id}`,
        method: "GET",
      });
      ctx.setloading(false);

      if (response.success) {
        setbook(response.data as BookType);
      } else {
        navigate("/notfound", { replace: true });
      }

      setreloaddata(false);
    };

    if (id && reloaddata) asyncgetBookDetails();
  }, [id, reloaddata]);

  const handleAddCart = async () => {
    const bookid = parseInt(id as string);
    setloading(true);
    const AddToBucket = await AddToBucketReq([bookid]);
    setloading(false);

    if (!AddToBucket) {
      toast.error("Can't Add To Bucket");
      return;
    }

    toast.success("Added To Bucket");
    ctx.setcartcount((prev) => prev + 1);
    setreloaddata(true);
  };

  return (
    <div className="w-full h-full flex justify-center items-center pb-32">
      <div className="w-[80%] h-fit flex flex-col items-start justify-start gap-y-5">
        <div className="w-full h-fit flex flex-col gap-y-5 items-center">
          <Image
            className="w-[350px] h-[400px] object-contain max-sm:w-[250px] max-sm:h-[350px]"
            src={book?.cover_img}
            alt="cover"
          />
          <div className="w-full h-fit flex flex-col gap-y-5">
            <h1 className="title">{book?.title}</h1>
            <p className="text-lg font-bold">By {book?.author}</p>
            <p className="detail_text des">{book?.description}</p>

            <table className="w-full h-fit">
              <tbody>
                {book?.publisher_date && (
                  <tr>
                    <th className="align-middle" align="left">
                      Publisher Date
                    </th>
                    <td height={"50px"}>
                      {formatDateToMMDDYYYYHHMMSS(
                        new Date(book.publisher_date)
                      )}
                    </td>
                  </tr>
                )}
                <tr>
                  <th align="left" className="align-middle">
                    Categories{" "}
                  </th>
                  <td height={100}>
                    {book?.categories.map((i) => i.name).join(` / `)}
                  </td>
                </tr>
              </tbody>
              <tr>
                <th className="align-middle" align="left">
                  ISBN{" "}
                </th>
                <td>
                  <ul className="ISBN_LIST w-full h-fit flex flex-col gap-y-5 list-none font-medium text-lg">
                    {book?.ISBN.map((isbn, idx) => (
                      <li key={idx}>
                        {isbn.type}:{isbn.identifier}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            </table>
          </div>
        </div>
        {book?.status !== BookStatus.UNAVAILABLE ? (
          user?.role !== ROLE.STUDENT ? (
            <Button className="bg-green-500 w-full font-bold text-white">
              AVALIABLE
            </Button>
          ) : (
            <Button
              onClick={() => handleAddCart()}
              className="bg-[#4682B4] font-bold text-white transition-all w-full"
              isLoading={loading}
              endContent={<i className="fa-solid fa-plus"></i>}
            >
              {loading ? `BORROWING...` : "BORROW"}
            </Button>
          )
        ) : (
          <Button className="min-w-[200px] w-[50%] bg-slate-500 text-white font-bold">
            UNAVALIABLE
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;
