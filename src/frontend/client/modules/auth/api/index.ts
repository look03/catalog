import type { LoginResponse } from '~/modules/auth/types';
import { useAuthStore } from '../stores/authStore';

export async function login(email: string, password: string) {
  try {
    const authStore = useAuthStore();
    const response = await useApi.post<LoginResponse>(
      '/auth/login',
      { email, password },
      { credentials: 'include' },
      { auth: false }
    );
    if (response.accessToken) {
      authStore.setAccessToken(response.accessToken);
      navigateTo('/admin');
    }
  } catch (error) {
    logError('AUTH_LOGIN', 'GET', error);
  }
}

export async function logout() {
  try {
    await useApi.post('/auth/logout/', {}, {}, { auth: true });

    navigateTo('/auth');
  } catch (error) {
    logError('AUTH_LOGOUT', 'GET', error);
  }
}
