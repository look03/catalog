import { redirectToAuth } from '~/composables/useApi';

/**
 * Редирект на /auth при заходе в admin без токена (в т.ч. после 401).
 */
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthModule();
  if (!auth.accessToken?.value) {
    try {
      await refreshToken();
    } catch (error: any) {
      if (error?.statusCode === 401) {
        return redirectToAuth();
      }
    }
  }
});
