import { getList } from '../api';
import { useAdminStore } from '../stores/adminStore';

export function useAdminModule() {
  const adminStore = useAdminStore();
  const { tableData, tableHeaders, total, limit, page } = storeToRefs(adminStore);

  return {
    getList,
    tableData,
    tableHeaders,
    total,
    limit,
    page
  };
}
