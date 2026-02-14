import { defineStore } from 'pinia';
import type { AdminStore, CatalogProduct, ProductHeaders, ProductsResponse } from '../types';

export const useAdminStore = defineStore('admin-store', {
  state: (): AdminStore => ({
    tableData: undefined,
    tableHeaders: undefined,
    total: 0,
    limit: 4,
    page: 1,
    order: 'asc',
    sort: 'id'
  }),
  actions: {
    setProductsData(data: ProductsResponse) {
      this.tableData = data.items ?? undefined;
      if (!this.tableHeaders) {
        this.tableHeaders = data.headers ?? undefined;
      }
      this.total = data.total;
    },
    setPage(page: number) {
      this.page = page;
    }
  }
});
