import React, { Dispatch, SetStateAction, useContext } from "react";
import { BookCartType, BookType, BorrowBookType } from "./book.type";
import { DepartmentType, UserType } from "./user.type";
import { MyContext } from "../config/context";
import { FilterDataType, OpenModalType } from "./helpertype.type";

export interface ContextType {
  openmodal: OpenModalType;
  setopenmodal: Dispatch<SetStateAction<OpenModalType>>;
  hasLogin: boolean;
  sethasLogin: React.Dispatch<React.SetStateAction<boolean>>;
  filter_cat: string;
  setfilter_cat: React.Dispatch<React.SetStateAction<string>>;
  student: Array<UserType>;
  setstudent: React.Dispatch<React.SetStateAction<Array<UserType>>>;
  book?: BookType[];
  setbook: React.Dispatch<React.SetStateAction<BookType[] | undefined>>;
  bookcart: BookCartType[];
  setcart: React.Dispatch<React.SetStateAction<BookCartType[]>>;
  search: string;
  setsearch: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setloading: React.Dispatch<React.SetStateAction<boolean>>;
  added: boolean;
  setadded: React.Dispatch<React.SetStateAction<boolean>>;
  dep: Array<DepartmentType>;
  setdep: React.Dispatch<React.SetStateAction<Array<DepartmentType>>>;
  borrowedrequest: Array<BorrowBookType>;
  setborrowedrequest: React.Dispatch<
    React.SetStateAction<Array<BorrowBookType>>
  >;
  datatable_select: Set<string>;
  setselect: React.Dispatch<React.SetStateAction<Set<string>>>;
  page: number;
  setpage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  setlimit: React.Dispatch<React.SetStateAction<number>>;
  filterdata: FilterDataType;
  setfilterdata: React.Dispatch<React.SetStateAction<FilterDataType>>;
  isSearch: boolean;
  setisSearch: React.Dispatch<React.SetStateAction<boolean>>;
  toastid: string;
  settoastid: React.Dispatch<React.SetStateAction<string>>;
  globalindex: number;
  setglobalindex: React.Dispatch<React.SetStateAction<number>>;
  cartcount: number;
  setcartcount: React.Dispatch<React.SetStateAction<number>>;
  globalstatestring: string;
  setglobalstatestring: React.Dispatch<React.SetStateAction<string>>;
}

export const useGlobalContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("Context Not Found");
  } else {
    return context;
  }
};
