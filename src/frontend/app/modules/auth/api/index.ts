import type { LoginResponse, RegisterResponse } from '~/modules/auth/types';
import { useAuthStore } from '../stores/authStore';

/**
 *
 * @param email
 * @param password
 */
export async function login(email: string, password: string): Promise<void> {
  try {
    const authStore = useAuthStore();
    const response = await useApi.post<LoginResponse>(
      '/auth/login',
      { email, password },
      { credentials: 'include' },
      {},
      { auth: false }
    );
    if (response.accessToken) {
      authStore.setAccessToken(response.accessToken);
      navigateTo('/admin');
    }
  } catch (error) {
    console.log(555555555, '<<<<<<<<<<<<<< 555555555');
    logError('AUTH_LOGIN', 'POST', error);
  }
}

/**
 *
 * @param email
 * @param password
 */
export async function register(email: string, password: string): Promise<void> {
  try {
    const response = await useApi.post<RegisterResponse>(
      '/auth/register',
      { email, password },
      {},
      {},
      { auth: false }
    );
    if (response.userId) {
      await login(email, password);
    }
  } catch (error) {
    logError('AUTH_REGISTER', 'POST', error);
  }
}

export async function logout(): Promise<void> {
  try {
    console.log(44444444444, '<<<<<<<<<<<<<< 44444444444');
    await useApi.post('/auth/logout/', {}, { credentials: 'include' }, { auth: true });

    navigateTo('/auth');
  } catch (error) {
    logError('AUTH_LOGOUT', 'POST', error);
  }
}
