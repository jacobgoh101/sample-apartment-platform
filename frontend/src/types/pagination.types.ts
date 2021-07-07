interface Links {
  first: string;
  previous: string;
  next: string;
  last: string;
}

interface Meta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PagingResult<T> {
  items: T[];
  meta: Meta;
  links: Links;
}

export interface PagingOption {
  limit: number;
  page: number;
}
