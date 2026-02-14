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

export type AdminStore = {
  tableData: CatalogProduct[] | undefined;
  tableHeaders: ProductHeaders | undefined;
  total: number;
  limit: number;
  page: number;
  order: 'asc' | 'desc';
  sort: string;
};

export type OptionsTable = {
  limit?: number;
  page?: number;
  order?: string;
  sort?: string;
};
