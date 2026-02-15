export type SectionForProduct = {
  name: string;
  path: string;
  pathDetail: string;
};

export type CatalogProduct = {
  id: number;
  name: string;
  sections: SectionForProduct[];
  paths: string[];
  code: string;
  price: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductHeaders = {
  id: string;
  name: string;
  sections: string;
  paths: string;
  code: string;
  price: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductsResponse = {
  headers: ProductHeaders | null;
  items: CatalogProduct[] | null;
  total: number;
};

export type OrderType = 'asc' | 'desc';

export type SortType = 'id' | 'name' | 'createdAt' | 'updatedAt';

export type Sort = {
  sort: SortType;
  order: OrderType;
};

export type TableType = 'products' | 'sections';

export type CatalogSection = {
  id: number;
  name: string;
  code: string;
  path: string;
  parent_section_id: number | null;
  parent_section: { name?: string; path?: string } | null;
  createdAt: string;
  updatedAt: string;
};

export type SectionsResponse = {
  items: CatalogSection[] | null;
  total: number;
};

export type AdminFilters = {
  name?: string;
  code?: string;
  id?: string;
};

export type AdminStore = {
  tableData: CatalogProduct[] | undefined;
  tableHeaders: ProductHeaders | undefined;
  total: number;
  limit: number;
  page: number;
  tableType: TableType;
  filters: AdminFilters;
} & Sort;

export type OptionsTable = {
  limit?: number;
  page?: number;
  order?: string;
  sort?: string;
  name?: string;
  code?: string;
  id?: number;
};
