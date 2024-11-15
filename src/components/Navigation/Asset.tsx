import { ReactNode } from "react";

export const MenuItemList: Array<{
  page: string;
  path: string;
  isADMIN?: boolean;
  isHD?: boolean;
  icon: ReactNode;
}> = [
  {
    page: "BROWSE",
    path: "/",
    icon: <i className="fa-solid fa-receipt fa-xl"></i>,
  },
  {
    page: "MY BOOKS",
    path: "/borrowedbook",
    icon: <i className="fa-solid fa-receipt fa-xl"></i>,
  },
  {
    page: "BORROWED BOOKS",
    path: "/borrowedbook",
    isADMIN: true,
    icon: <i className="fa-solid fa-receipt fa-xl"></i>,
  },
  {
    page: "LIST OF BOOK",
    path: "/booklist",
    isADMIN: true,
    icon: <i className="fa-solid fa-book-bookmark fa-xl"></i>,
  },
  {
    page: "STUDENT LIST",
    path: "/userlist",
    isADMIN: true,
    icon: <i className="fa-solid fa-address-book fa-xl"></i>,
  },
  {
    page: "SCAN ENTRY",
    path: "/scanentry",
    isADMIN: true,
    icon: <i className="fa-solid fa-qrcode fa-xl"></i>,
  },
  {
    page: "SCAN BOOK",
    path: "/scanr",
    isADMIN: true,
    icon: <i className="fa-solid fa-qrcode fa-xl"></i>,
  },
  {
    page: "SUMMARY STUDENTS",
    path: "/summary",
    isADMIN: true,
    isHD: true,
    icon: <i className="fa-solid fa-address-book fa-xl"></i>,
  },
];
