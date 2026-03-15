import { defineStore } from 'pinia';
import type { AuthStore } from '../types';

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthStore => ({
    accessToken: undefined,
    loginError: undefined
  }),
  actions: {
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken;
    },
    clearUserInfo() {
      this.accessToken = undefined;
    },
    setLoginError(message: string) {
      this.loginError = message;
    },
    clearLoginError() {
      this.loginError = undefined;
    }
  }
});
