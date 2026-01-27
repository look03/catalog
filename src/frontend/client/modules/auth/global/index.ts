import { useAuthStore } from '../stores/authStore';
import { login, logout } from '../api';

export function useAuthModule() {
  const authStore = useAuthStore();
  const { accessToken } = storeToRefs(authStore);

  return {
    accessToken,
    login,
    logout,
    setToken: authStore.setAccessToken,
    clearToken: authStore.clearAccessToken
  };
}
