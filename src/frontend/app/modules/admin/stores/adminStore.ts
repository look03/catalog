import { defineStore } from 'pinia';
import type {
  AdminFilters,
  AdminStore,
  CatalogProduct,
  CatalogSection,
  ProductsResponse,
  SectionsResponse,
  Sort,
  TableType
} from '../types';

export const useAdminStore = defineStore('admin-store', {
  state: (): AdminStore => ({
    tableProductsData: undefined,
    tableProductsHeaders: undefined,
    tableSectionsData: undefined,
    tableSectionsHeaders: undefined,
    total: 0,
    limit: 4,
    page: 1,
    order: 'asc',
    sort: 'id',
    tableType: 'products',
    filters: {
      name: undefined,
      code: undefined,
      id: undefined
    }
  }),
  actions: {
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
    }
  }
});
