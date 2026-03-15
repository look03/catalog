/**
 * Глобальные тосты при ошибках (регистрация, API, любой экран).
 * Вызвать один раз в корне приложения (app.vue), затем использовать show() где угодно.
 */
export function useErrorToast() {
  const { t } = useI18n();
  const toast = useToast();
  const appStore = useAppStore();

  watch(
    () => appStore.toastError,
    (key) => {
      if (!key) {
        return;
      }

      toast.add({
        title: t(key),
        color: 'error',
        icon: 'i-lucide-alert-circle'
      });
      appStore.clearToastError();
    }
  );

  return {
    show: (i18nKey: string) => appStore.setToastError(i18nKey)
  };
}
