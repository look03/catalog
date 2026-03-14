import {
  getList,
  getUserData,
  deleteRow,
  createSection,
  createProduct,
  openEditForm,
  updateSection,
  updateProduct
} from '../api';
import { useAdminStore } from '../stores/adminStore';

export function useAdminModule() {
  const adminStore = useAdminStore();
  const { tableProductsData, tableProductsHeaders, total, limit, page, tableType } =
    storeToRefs(adminStore);

  return {
    getList,
    getUserData,
    deleteRow,
    createSection,
    createProduct,
    openEditForm,
    updateSection,
    updateProduct,
    tableProductsData,
    tableProductsHeaders,
    total,
    limit,
    page,
    tableType
  };
}
