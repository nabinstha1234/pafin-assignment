export interface IPagingArgs {
  skip?: number;
  limit?: number;
  sort?: { column: string; order: 'asc' | 'desc' };
  query?: any;
}

export interface IPagingResult {
  total: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
}

export interface IPaginationData<T> {
  paging: IPagingResult;
  results: T;
}

export interface IGetAllAndCountResult<T> {
  count: number;
  rows: T;
}
