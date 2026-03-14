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
  productForm: ProductForm;
  editIdItem: number | undefined;
} & Sort;

export type SelectOption = { id: number; name: string };

/** Элемент изображения: id — для удаления при редактировании, path — URL для отображения */
export type ProductImageItem = { id: number; path: string };

export type ProductForm = {
  title: string;
  price: number;
  section_ids: number[];
  color: string;
  preview_text: string;
  brand_id: number | undefined;
  files: File[];
  images: ProductImageItem[];
  active?: boolean;
};

/** Ответ API GET /admin/product/:id (без files) */
export type ProductFormFields = Omit<ProductForm, 'files'>;

/** Payload для PATCH (files и image_ids_to_remove опциональны) */
export type UpdateProductPayload = Omit<ProductForm, 'files'> & {
  files?: File[];
  image_ids_to_remove?: number[];
};
