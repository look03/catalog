import { getList, getUserData } from '../api';
import { useAdminStore } from '../stores/adminStore';

export function useAdminModule() {
  const adminStore = useAdminStore();
  const { tableProductsData, tableProductsHeaders, total, limit, page, tableType } =
    storeToRefs(adminStore);

  return {
    getList,
    getUserData,
    tableProductsData,
    tableProductsHeaders,
    total,
    limit,
    page,
    tableType
  };
}
