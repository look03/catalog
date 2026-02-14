export default defineNuxtPlugin(async () => {
  const auth = useAuthModule();
  if (!auth.accessToken?.value) {
    try {
      await refreshToken();
    } catch (error: any) {
      console.log(error, '<<<<<<<<<<<<<< error');
      if (error?.response?.status === 401) {
        navigateTo('/auth');
      }
    }
  }
});
