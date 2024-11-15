import { DateValue, RangeValue } from "@nextui-org/react";
import { UserType } from "./user.type";

export interface ISBN_OBJ {
  type: string;
  identifier: string;
}

export enum BookStatus {
  TOPICKUP = "ToPickUp",
  PICKEDUP = "PickedUp",
  RETURNED = "Returned",
  AVAILABLE = "Available",
  UNAVAILABLE = "Unavailable",
}

export enum BucketStatus {
  INCART = "incart",
  CHECKOUT = "checkout",
}

export interface BookCartType {
  id?: number;
  books: BookType[] | [];
}

export interface CategoyType {
  id?: number;
  name: string;
  description?: string;
}

export interface BookType {
  id?: number;
  ISBN: ISBN_OBJ[];
  title: string;
  description?: string;
  cover_img?: string;
  categories: Array<CategoyType>;
  author: string[];
  publisher_date?: Date;
  status: BookStatus;
  borrow_count: number;
  returndate?: Date;
  user?: UserType;
  BookBucket?: { returndate: Date | null };
}

export interface BorrowBookType {
  id?: number;
  borrow_id?: string;
  bucket: BookBucketType;
  createdAt: Date;
  status: BookStatus;
  expect_return_date?: Date;
  return_date?: Date;
  user?: UserType;
  qrcode: string;
}

export interface BookBucketType {
  id: number;
  books: BookType[];
  status: BucketStatus;
}

export interface FilterTableDataType {
  daterange?: RangeValue<DateValue>;
  search?: string;
}
