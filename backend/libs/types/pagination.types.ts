// https://github.com/nestjsx/nestjs-typeorm-paginate/blob/04ce5a9782f69e5311c719551f134661e5844927/src/interfaces/index.ts

export class Pagination<
  PaginationObject,
  T extends ObjectLiteral = IPaginationMeta
> {
  constructor(
    /**
     * a list of items to be returned
     */
    public readonly items: PaginationObject[],
    /**
     * associated meta information (e.g., counts)
     */
    public readonly meta: T,
    /**
     * associated links
     */
    public readonly links?: IPaginationLinks,
  ) {}
}

export interface IPaginationOptions<CustomMetaType = IPaginationMeta> {
  /**
   * the amount of items to be requested per page
   */
  limit: number | string;
  /**
   * the page that is requested
   */
  page: number | string;
  /**
   * a babasesic route for generating links (i.e., WITHOUT query params)
   */
  route?: string;

  metaTransformer?: (meta: IPaginationMeta) => CustomMetaType;

  /**
   * routingLabels for append in links (limit or/and page)
   */
  routingLabels?: IPaginationOptionsRoutingLabels;
}

export interface ObjectLiteral {
  [s: string]: any;
}

export interface IPaginationMeta extends ObjectLiteral {
  /**
   * the amount of items on this specific page
   */
  itemCount: number;
  /**
   * the total amount of items
   */
  totalItems: number;
  /**
   * the amount of items that were requested per page
   */
  itemsPerPage: number;
  /**
   * the total amount of pages in this paginator
   */
  totalPages: number;
  /**
   * the current page this paginator "points" to
   */
  currentPage: number;
}

export interface IPaginationLinks {
  /**
   * a link to the "first" page
   */
  first?: string;
  /**
   * a link to the "previous" page
   */
  previous?: string;
  /**
   * a link to the "next" page
   */
  next?: string;
  /**
   * a link to the "last" page
   */
  last?: string;
}

export interface IPaginationOptionsRoutingLabels {
  /**
   * the limit text to append in router string
   */
  limitLabel?: string;

  /**
   * the page text to append in router string
   */
  pageLabel?: string;
}
