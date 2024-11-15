import { BorrowBookType } from "./book.type";

export interface FacultyType {
  id?: number;
  name: string;
  departments: Array<DepartmentType>;
}
export interface DepartmentType {
  id?: number;
  faculty?: {
    id: number;
    name: string;
  };
  department?: string;
}

export enum ROLE {
  STUDENT = "STUDENT",
  HEADDEPARTMENT = "HEADDEPARTMENT",
  LIBRARIAN = "LIBRARIAN",
}

export interface UserType {
  id?: number;
  firstname: string;
  lastname: string;
  fullname?: string;
  email: string;
  department?: DepartmentType;
  role: ROLE;
  studentID: string;
  phone_number?: string;
  entries?: LibraryEntryType[];
  profile?: string;
  borrowbook?: BorrowBookType[];
  date_of_birth?: Date;
  password?: string;
  cart?: number;
}

export interface LibraryEntryType {
  id: number;
  userId: number;
  createdAt: Date;
}

export interface LoginType {
  email: string;
  password: string;
  confirmpassword: string;
  code: string;
}
