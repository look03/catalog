/**
 * Глобальные тосты при ошибках (регистрация, API, любой экран).
 * Вызвать один раз в корне приложения (app.vue), затем использовать show() где угодно.
 */
export function useToasts() {
  const { t } = useI18n();
  const toast = useToast();
  const appStore = useAppStore();

  watch(
    () => appStore.toastError,
    (key) => {
      if (!key) return;
      toast.add({
        title: t(key),
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000
      });
      appStore.clearToastError();
    }
  );

  watch(
    () => appStore.toastSuccess,
    (key) => {
      if (!key) {
        return;
      }

      toast.add({
        title: t(key),
        color: 'success',
        icon: 'i-lucide-circle-check',
        duration: 2000
      });
      appStore.clearToastSuccess();
    }
  );

  return {
    show: (i18nKey: string) => appStore.setToastError(i18nKey),
    showSuccess: (i18nKey: string) => appStore.setToastSuccess(i18nKey)
  };
}
