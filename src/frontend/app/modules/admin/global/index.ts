import { getList } from '../api';

export function useAdminModule() {
  // const authStore = useAuthStore();
  // const { accessToken } = storeToRefs(authStore);

  return {
    getList
  };
}
