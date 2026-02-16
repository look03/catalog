import { defineStore } from 'pinia';
import type {
  AdminFilters,
  AdminStore,
  CatalogProduct,
  ProductsResponse,
  Sort,
  TableType
} from '../types';

export const useAdminStore = defineStore('admin-store', {
  state: (): AdminStore => ({
    tableData: undefined,
    tableHeaders: undefined,
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
      this.tableData = (data.items ?? undefined) as CatalogProduct[] | undefined;
      this.tableHeaders = data.headers ?? undefined;
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
      this.page = 1;
    },
    setFilters(payload: AdminFilters) {
      if (payload.name !== undefined) {
        this.filters.name = payload.name;
      }

      if (payload.code !== undefined) {
        this.filters.code = payload.code;
      }

      if (payload.id !== undefined) {
        this.filters.id = payload.id;
      }

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
