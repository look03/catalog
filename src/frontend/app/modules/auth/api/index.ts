import type { LoginResponse, RegisterResponse } from '~/modules/auth/types';
import { useAuthStore } from '../stores/authStore';

/**
 *
 * @param email
 * @param password
 */
export async function login(email: string, password: string): Promise<void> {
  const authStore = useAuthStore();
  authStore.clearLoginError();
  try {
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
    logError('AUTH_LOGIN', 'POST', error);
    authStore.setLoginError('auth.wrongCredentials');
  }
}

/**
 *
 * @param email
 * @param password
 */
export async function register(email: string, password: string): Promise<void> {
  const authStore = useAuthStore();
  authStore.clearRegisterError();
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
    authStore.setRegisterError('auth.registerFailed');
  }
}

export async function logout(): Promise<void> {
  try {
    await useApi.post('/auth/logout/', {}, { credentials: 'include' }, { auth: true });
  } catch (error) {
    logError('AUTH_LOGOUT', 'POST', error);
  } finally {
    useAuthStore().clearUserInfo();
    navigateTo('/auth');
  }
}
