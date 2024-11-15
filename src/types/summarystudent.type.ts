export interface FilterDateRangeType {
  name: string;
  filter: {
    start: Date;
    end: Date;
  };
}

interface TimeFrameCountType {
  monthly: {
    [key: string]: {
      monthCount: number;
      weekly: {
        [key: string]: number;
      };
    };
  };
  total: number;
}

export interface ResultSubDataType {
  borrowedbook: TimeFrameCountType;
  entry: TimeFrameCountType;
}

export interface ResultDataType {
  [key: string]: ResultSubDataType;
}
