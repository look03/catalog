import { getCatalogData } from '../api';

export function useCatalogModule() {
  // const authStore = useAuthStore();
  // const { accessToken } = storeToRefs(authStore);

  return {
    getCatalogData
  };
}
