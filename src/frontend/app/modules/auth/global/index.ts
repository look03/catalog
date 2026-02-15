import { useAuthStore } from '../stores/authStore';
import { login, logout, register } from '../api';

export function useAuthModule() {
  const authStore = useAuthStore();
  const { accessToken } = storeToRefs(authStore);

  return {
    accessToken,
    login,
    logout,
    register,
    setToken: authStore.setAccessToken,
    clearUserInfo: authStore.clearUserInfo
  };
}
