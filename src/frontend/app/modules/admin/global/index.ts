import { getList, getUserData } from '../api';
import { useAdminStore } from '../stores/adminStore';

export function useAdminModule() {
  const adminStore = useAdminStore();
  const { tableData, tableHeaders, total, limit, page } = storeToRefs(adminStore);

  return {
    getList,
    getUserData,
    tableData,
    tableHeaders,
    total,
    limit,
    page
  };
}
