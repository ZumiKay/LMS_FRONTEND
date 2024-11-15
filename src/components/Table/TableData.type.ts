export type tabletype = "userlist" | "booklist" | "borrowedbook";

export interface TableColumnType {
  name: string;
  uid: string;
  sortable?: boolean;
  action?: boolean;
}
