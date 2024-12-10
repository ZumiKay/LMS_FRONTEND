import React, { useEffect, useState } from "react";
import "../../style/style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Navigation, A11y } from "swiper/modules";
import { setimage } from "../../assets/globalassets";
import { BookType, CategoyType } from "../../types/book.type";
import { useGlobalContext } from "../../types/context.type";
import { ApiRequest, normalizeString } from "../../utilities/helper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Selection from "../Selection";
import { Button, CircularProgress, Pagination } from "@nextui-org/react";
import PageLoading, { SliderLoading } from "../../Loading";
//

const Home = () => {
  const ctx = useGlobalContext();
  const [change, setchange] = useState<boolean>(false);
  const [loading, setloading] = useState(false);
  const [openfilter, setopen] = useState<boolean>(false);
  const [filterbook, setfilterbook] = useState<Array<BookType>>();
  const [popularbook, setpopularbook] = useState<Array<BookType>>();
  const [latestbook, setlatestbook] = useState<Array<BookType>>();
  const [filterloading, setfilterloading] = useState(false);

  // Filter Book Fetch
  useEffect(() => {
    const getBook = async () => {
      setfilterloading(true);
      const response = await ApiRequest({
        url: `/getallbook?type=filter&${
          ctx.search
            ? `search=${normalizeString(ctx.search)}`
            : `cate=${ctx.filter_cat}`
        }`,
        method: "GET",
      });
      setfilterloading(false);

      if (ctx.isSearch) {
        ctx.setisSearch(false);
      }

      if (response.success) {
        setfilterbook(response.data as Array<BookType>);
      }
    };

    if ((ctx.isSearch && ctx.search !== "") || ctx.filter_cat !== "") getBook();
  }, [ctx.isSearch, ctx.filter_cat]);

  useEffect(() => {
    const getPopularBook = async () => {
      const url = (type: string, limit?: number) =>
        `/getallbook?type=filter&${type}=true${limit ? `&limit=${limit}` : ""}`;
      const popular = await ApiRequest({
        url: url("popular", 10),
        method: "GET",
      });

      const latest = await ApiRequest({
        url: url("latest", 10),
        method: "GET",
      });

      setloading(true);
      const allpromise = await Promise.all([popular, latest]);
      setloading(false);

      if (Object.values(allpromise).every((i) => i.success)) {
        setpopularbook(allpromise[0].data as Array<BookType>);
        setlatestbook(allpromise[1].data as Array<BookType>);
      }
    };

    getPopularBook();
  }, []);

  useEffect(() => {
    if (ctx.filter_cat !== "") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [ctx.filter_cat]);
  useEffect(() => {
    const handleresize = () => {
      if (window.innerWidth < 1090) {
        setchange(true);
      } else {
        setchange(false);
      }
    };
    handleresize();
    window.addEventListener("resize", handleresize);
    return () => window.removeEventListener("resize", handleresize);
  }, []);
  return (
    <div className="w-full h-full">
      {loading && <PageLoading />}

      <div
        style={ctx.openmodal.search ? { marginTop: "50px" } : {}}
        className="Home_page"
      >
        {filterloading && <SliderLoading />}
        {ctx.search !== "" && filterbook && (
          <SliderContainer
            book={filterbook}
            title={ctx.search}
            type={"search"}
          />
        )}
        {ctx.filter_cat !== "" && filterbook && (
          <SliderContainer
            title={ctx.filter_cat}
            type="filter"
            book={filterbook}
          />
        )}
        <div className="w-full h-fit pl-1">
          <div className="section_title">Latest Books</div>
        </div>
        <div className="popularbook_wrapper">
          {loading && <CircularProgress />}
          {latestbook?.map((latest, idx) => (
            <Popularbook {...latest} key={idx} />
          ))}
        </div>
        <div className="w-full h-fit pl-1">
          <div className="section_title">Popular Books</div>
        </div>
        <div className="popularbook_wrapper">
          {loading && <CircularProgress />}
          {popularbook?.map((popular, idx) => (
            <Popularbook {...popular} key={idx} />
          ))}
        </div>
        <div className="w-full h-fit pl-1">
          <div className="section_title">All Books</div>
        </div>
        <AllbookContainer />
      </div>
      {change ? (
        openfilter ? (
          <FilterNavigation resize={change} setopen={setopen} />
        ) : (
          <i
            onClick={() => setopen(true)}
            className="fa-sharp fa-solid fa-filter fa-xl filter-icon"
          ></i>
        )
      ) : (
        <FilterNavigation resize={change} />
      )}
    </div>
  );
};

export default Home;

const SliderContainer = ({
  title,
  book,
  type,
}: {
  title: string;
  book: BookType[];
  type: string;
}) => {
  const { setsearch } = useGlobalContext();
  const navigate = useNavigate();

  return (
    <div className="slider_container">
      <Button
        onClick={() => setsearch("")}
        className="cursor-pointer font-bold"
        size="sm"
        color="danger"
      >
        Clear
      </Button>
      <p className="title">
        {type === "filter" ? title : `Search for: ${title}`}
      </p>
      <Swiper
        modules={[Navigation, A11y]}
        spaceBetween={50}
        slidesPerView={"auto"}
        className="slider"
      >
        {book?.map((i) => (
          <SwiperSlide key={i.id} className="swiper_slide">
            <div onClick={() => navigate(`/book/${i.id}`)} className="book">
              <img
                src={i.cover_img ? i.cover_img : setimage.Default}
                alt=""
                className="book_cover"
              />
              <div className="book_title">{i.title}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const AllbookContainer = () => {
  const [searchparam, setsearchparam] = useSearchParams();
  const [currentPage, setcurrentPage] = useState(
    searchparam.get("page") ?? "1"
  );
  const [currentShowPerPage, setcurrentShowPerPage] = useState(
    searchparam.get("show") ?? "6"
  );

  const [books, setbooks] = useState<BookType[]>();
  const [count, setcount] = useState(0);
  const navigate = useNavigate();
  const handleChange = (page: number) => {
    setcurrentPage(page.toString());
    setsearchparam((prev) => ({ ...prev, page }));
  };

  const handleChangePerPage = (show: number) => {
    setcurrentShowPerPage(show.toString());
    setsearchparam((prev) => ({ ...prev, show }));
  };

  //Fetch All Book
  useEffect(() => {
    const getBook = async () => {
      const response = await ApiRequest({
        url: `/getallbook?limit=${currentShowPerPage}&page=${currentPage}&type=all`,
        method: "GET",
      });
      if (response.success) {
        setbooks(response.data as BookType[]);
        setcount(response.totalcount as number);
      }
    };

    getBook();
  }, [currentPage, currentShowPerPage]);

  return (
    <div className="allbook_container">
      <div className="book">
        {books?.map((i) => (
          <div key={i.id} className="book_container">
            <img
              onClick={() => navigate(`/book/${i.id}`)}
              src={
                i.cover_img && i.cover_img !== ""
                  ? i.cover_img
                  : setimage.Default
              }
              alt="cover"
              className="book_cover"
            />
            <div className="book_title">{i.title}</div>
            {i.publisher_date && (
              <p className="detail">
                {i.author} - {new Date(i.publisher_date).getFullYear()}
              </p>
            )}
          </div>
        ))}
      </div>

      {books && books.length > 0 && (
        <div className="w-full h-fit flex flex-col items-center gap-y-5">
          <Pagination
            className="mt-5"
            total={Math.ceil(count / Number(currentShowPerPage))}
            initialPage={1}
            page={Number(currentPage)}
            onChange={handleChange}
            isCompact
            siblings={1}
          />
          <Selection
            selectdata={["6", "12", "24"].map((i) => ({
              label: i,
              value: i,
            }))}
            label="Show Per Page"
            value={currentShowPerPage}
            width="200px"
            handleChange={(val) => {
              handleChangePerPage(
                parseInt(val.target.value.length > 0 ? val.target.value : "6")
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

const FilterNavigation = ({
  resize,
  setopen,
}: {
  resize: boolean;
  setopen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [search, setsearch] = useState("");
  const [categories, setcategories] = useState<Array<CategoyType>>();
  const ctx = useGlobalContext();

  useEffect(() => {
    const getCate = async () => {
      const resposne = await ApiRequest({
        url: "/getallcategory",
        method: "GET",
      });

      if (resposne.success) {
        setcategories(resposne.data as CategoyType[]);
      }
    };

    getCate();
  }, []);

  return (
    <>
      <div className="Filter_container">
        {resize && (
          <i
            onClick={() => setopen && setopen(false)}
            className="fa-solid fa-circle-xmark fa-2xl"
            style={{ marginBottom: "20px", marginTop: "10px" }}
          ></i>
        )}
        <input
          type="text"
          id="search_cate"
          onChange={(e) => {
            setsearch(e.target.value);
          }}
          placeholder="Search Categories"
        />
        <p style={{ marginBottom: "20px" }}>Filter By Categories</p>
        {categories
          ?.filter((i) => i.name.includes(search))
          ?.map((cate, idx) => (
            <p
              key={idx}
              onClick={() => {
                if (ctx.filter_cat === cate.name) {
                  ctx.setfilter_cat("");
                } else {
                  ctx.setfilter_cat(cate.name);
                }
              }}
              style={
                ctx.filter_cat === cate.name
                  ? { backgroundColor: "black", color: "white" }
                  : { color: "#4682B4" }
              }
              className="filter_option"
            >
              {cate.name}
            </p>
          ))}
      </div>
    </>
  );
};

const Popularbook = (props: BookType) => {
  return (
    <Link to={`/book/${props.id}`} className="popularbook_container">
      <div className="book_container">
        <img src={props.cover_img} className="cover_img" alt="bookcover" />
        <div className="book_detail">
          <p className="title">{props.title}</p>
          <p className="subtitle">
            {props.author.length > 0 ? `By ${props.author.join("|")}` : ""}
          </p>
        </div>
      </div>
    </Link>
  );
};
