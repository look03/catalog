import { getList, getUserData, deleteRow } from '../api';
import { useAdminStore } from '../stores/adminStore';

export function useAdminModule() {
  const adminStore = useAdminStore();
  const { tableProductsData, tableProductsHeaders, total, limit, page, tableType } =
    storeToRefs(adminStore);

  return {
    getList,
    getUserData,
    deleteRow,
    tableProductsData,
    tableProductsHeaders,
    total,
    limit,
    page,
    tableType
  };
}
