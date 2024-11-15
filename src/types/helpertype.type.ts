export interface SelectionDataType {
  label: string;
  value: string;
}

export type TableColumnType = Array<{
  id: string;
  label: string;
  minWidth: number;
  align?: "center" | "left" | "right" | "inherit" | "justify";
}>;

export interface OpenModalType {
  register?: boolean;
  deleteModal?: boolean;
  detailModal?: boolean;
  imageModal?: boolean;
  userModal?: boolean;
  [key: string]: boolean | undefined;
}

export interface FilterDataType {
  status?: string[];
  search?: string;
  categories?: string[];
  [key: string]: unknown;
}
