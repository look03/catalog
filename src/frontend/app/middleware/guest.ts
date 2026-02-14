/**
 * Для страницы логина: если пользователь уже авторизован — редирект на /admin.
 */
export default defineNuxtRouteMiddleware(async () => {
  let sessionId = useCookie('sessionId');

  if (import.meta.server && !sessionId) {
    const reqHeaders: any = useRequestHeaders(['cookie']);
    if (reqHeaders.cookie) {
      sessionId = reqHeaders.cookie['sessionId'];
    }
  }

  if (!sessionId.value) {
    return;
  }

  await refreshToken();
  const auth = useAuthModule();
  if (auth.accessToken?.value) {
    return navigateTo('/admin/', { replace: true });
  }
});
