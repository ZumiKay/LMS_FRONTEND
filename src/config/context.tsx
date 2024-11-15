import { createContext, ReactNode, useState } from "react";
import { ContextType } from "../types/context.type";
import { DepartmentType, UserType } from "../types/user.type";
import { BookType, BorrowBookType } from "../types/book.type";
import { FilterDataType, OpenModalType } from "../types/helpertype.type";

export const MyContext = createContext<ContextType | null>(null);

export default function Allcontext({ children }: { children: ReactNode }) {
  const prevcart = localStorage.getItem("cart");
  const [page, setpage] = useState(1);
  const [limit, setlimit] = useState(5);
  const [openmodal, setopenmodal] = useState<OpenModalType>({
    register: false,
  });
  const [toastid, settoastid] = useState("");
  const [borrowedrequest, setborrowedrequest] = useState<Array<BorrowBookType>>(
    []
  );
  const [hasLogin, sethasLogin] = useState(false);
  const [filter_cat, setfilter_cat] = useState("");
  const [student, setstudent] = useState<Array<UserType>>([]);
  const [book, setbook] = useState<BookType[]>();
  const [bookcart, setcart] = useState(JSON.parse(prevcart ?? "{}") || []);
  const [search, setsearch] = useState("");
  const [loading, setloading] = useState(false);
  const [added, setadded] = useState(false);
  const [dep, setdep] = useState<Array<DepartmentType>>([]);
  const [datatable_select, setselect] = useState<Set<string>>(new Set([]));
  const [isSearch, setisSearch] = useState(false);
  const [globalindex, setglobalindex] = useState(-1);
  const [cartcount, setcartcount] = useState(0);
  const [globalstatestring, setglobalstatestring] = useState("");
  const [filterdata, setfilterdata] = useState<FilterDataType>({
    search: "",
  });

  return (
    <MyContext.Provider
      value={{
        globalstatestring,
        setglobalstatestring,
        cartcount,
        setcartcount,
        isSearch,
        setisSearch,
        filterdata,
        setfilterdata,
        page,
        setpage,
        limit,
        setlimit,
        openmodal,
        setopenmodal,
        hasLogin,
        sethasLogin,
        filter_cat,
        setfilter_cat,
        student,
        setstudent,
        book,
        setbook,
        bookcart,
        setcart,
        search,
        setsearch,
        loading,
        setloading,
        added,
        setadded,
        dep,
        setdep,
        borrowedrequest,
        setborrowedrequest,
        datatable_select,
        setselect,
        toastid,
        settoastid,
        globalindex,
        setglobalindex,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}
