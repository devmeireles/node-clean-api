export interface IPaginationParams {
  page: number;
  limit: number;
}

export interface IPaginatedData<T> {
  items: T[];
  totalItems: number;
}
