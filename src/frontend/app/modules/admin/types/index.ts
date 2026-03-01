export type SectionForProduct = {
  name: string;
  path: string;
  pathDetail: string;
};

export type CatalogProduct = {
  id: number;
  active: boolean;
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
  active: string;
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
  active: boolean;
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
  active: string;
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
  active?: boolean;
};

export type SectionForm = {
  sectionName: string;
  parentSectionId: number | undefined;
  active?: boolean;
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
  openActionsAside: boolean;
  loadingForm: boolean;
  sectionForm: SectionForm;
  productForm: SectionForm;
  editIdItem: number | undefined;
} & Sort;

export type SelectOption = { id: number; name: string };

export type PayloadProduct = {
  title: string;
  price: number;
  section_ids: number[];
  color: string;
  preview_text: string;
  brand_id: number | undefined;
  files: File[];
};
