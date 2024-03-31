import {Book} from "./book";

export interface PagedBooks {
  content: Book[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export const emptyResult: PagedBooks = {
  content: [],
  pageable: {
    pageNumber: 0,
    pageSize: 20,
    sort: {sorted: false, unsorted: true, empty: true},
    offset: 0,
    paged: true,
    unpaged: false
  },
  totalPages: 0,
  totalElements: 0,
  last: true,
  first: true,
  size: 20,
  number: 0,
  sort: {sorted: false, unsorted: true, empty: true},
  numberOfElements: 0,
  empty: true
}
