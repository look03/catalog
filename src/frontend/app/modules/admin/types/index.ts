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

export type ParentSection = {
  name: string | undefined;
  path: string | undefined;
};

export type CatalogSection = {
  id: number;
  name: string;
  code: string;
  path: string;
  parentSectionId: number | undefined | null;
  parentSection: ParentSection | null;
  createdAt: string;
  updatedAt: string;
};

export type SectionsResponse = {
  items: CatalogSection[] | null;
  total: number;
  headers: SectionHeaders | null;
};

export type SectionHeaders = {
  id: string;
  name: string;
  code: string;
  path: string;
  parent_section_id: string;
  parent_section: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminFilters = {
  name?: string;
  code?: string;
  id?: string;
};

export type AdminStore = {
  tableProductsData: CatalogProduct[] | undefined;
  tableProductsHeaders: ProductHeaders | undefined;
  tableSectionsData: CatalogSection[] | undefined;
  tableSectionsHeaders: SectionHeaders | undefined;
  total: number;
  limit: number;
  page: number;
  tableType: TableType;
  filters: AdminFilters;
} & Sort;
