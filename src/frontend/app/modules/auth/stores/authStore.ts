import { defineStore } from 'pinia';
import type { AuthStore } from '../types';

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthStore => ({
    accessToken: undefined
  }),
  actions: {
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken;
    },
    clearUserInfo() {
      this.accessToken = undefined;
    }
  }
});
