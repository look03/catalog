import { defineStore } from 'pinia';
import type { AppState } from './types';
import type { User } from '~/types';

export const useAppStore = defineStore('app-store', {
  state: (): AppState => ({
    user: {
      email: undefined
    },
    toastError: undefined,
    toastSuccess: undefined
  }),
  actions: {
    setUserData(userData: User) {
      this.user = userData;
    },
    setToastError(i18nKey: string) {
      this.toastError = i18nKey;
    },
    clearToastError() {
      this.toastError = undefined;
    },
    setToastSuccess(i18nKey: string) {
      this.toastSuccess = i18nKey;
    },
    clearToastSuccess() {
      this.toastSuccess = undefined;
    }
  }
});
