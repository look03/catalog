import { defineStore } from 'pinia';
import type {
  AdminFilters,
  AdminStore,
  CatalogProduct,
  CatalogSection,
  ProductsResponse,
  SectionsResponse,
  Sort,
  TableType,
  SectionForm
} from '../types';

export const useAdminStore = defineStore('admin-store', {
  state: (): AdminStore => ({
    tableProductsData: undefined,
    tableProductsHeaders: undefined,
    tableSectionsData: undefined,
    tableSectionsHeaders: undefined,
    total: 0,
    limit: 10,
    page: 1,
    order: 'asc',
    sort: 'id',
    tableType: 'products',
    openActionsAside: false,
    loadingForm: false,
    editIdItem: undefined,
    sectionForm: {
      sectionName: '',
      parentSectionId: undefined,
      active: undefined
    },
    productForm: {
      sectionName: '',
      parentSectionId: undefined as number | undefined
    },
    filters: {
      name: undefined,
      code: undefined,
      id: undefined
    }
  }),
  actions: {
    setSectionFormValues(form: SectionForm) {
      (Object.entries(form) as [keyof SectionForm, SectionForm[keyof SectionForm]][]).forEach(
        ([field, value]) => {
          this.setSectionFormValue(field, value);
        }
      );
    },
    setSectionFormValue<K extends keyof SectionForm>(field: K, value: SectionForm[K]) {
      this.sectionForm[field] = value;
    },
    clearSectionForm() {
      this.sectionForm.sectionName = '';
      this.sectionForm.parentSectionId = undefined;
      this.sectionForm.active = undefined;

      this.editIdItem = undefined;
    },
    setOpenActionsAside(value: boolean) {
      this.openActionsAside = value;
    },
    setEditIdNumber(value: number | undefined) {
      this.editIdItem = value;
    },
    setProductsData(data: ProductsResponse) {
      this.tableProductsData = (data.items ?? undefined) as CatalogProduct[] | undefined;
      this.tableProductsHeaders = data.headers ?? undefined;
      this.total = data.total ?? 0;
    },
    setSectionsData(data: SectionsResponse) {
      this.tableSectionsData = (data.items ?? undefined) as CatalogSection[] | undefined;
      this.tableSectionsHeaders = data.headers ?? undefined;
      this.total = data.total ?? 0;
    },
    setPage(page: number) {
      this.page = page;
    },
    setLimit(limit: number) {
      this.limit = limit;
      this.page = 1;
    },
    setSort(payload: Sort) {
      this.sort = payload.sort;
      this.order = payload.order;
    },
    setTableType(type: TableType) {
      this.tableType = type;
      this.clearFilters();
      this.setSort({
        sort: 'id',
        order: 'asc'
      });
    },
    setFilters(payload: AdminFilters) {
      this.filters.name = payload.name;
      this.filters.code = payload.code;
      this.filters.id = payload.id;
      this.page = 1;
    },
    clearFilters() {
      this.filters.name = undefined;
      this.filters.code = undefined;
      this.filters.id = undefined;

      this.page = 1;
    },
    setAddElementTableOptions() {
      this.setSort({
        sort: 'id',
        order: 'desc'
      });
      this.setPage(1);
    },
    setLoadingForm(value: boolean) {
      this.loadingForm = value;
    },
    resetFormLoading() {
      this.loadingForm = false;
      this.openActionsAside = false;
    }
  }
});
