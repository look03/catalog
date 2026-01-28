export default defineNuxtPlugin(async () => {
  const auth = useAuthModule();
  if (!auth.accessToken?.value) {
    try {
      await refreshToken();
    } catch {}
  }
});
