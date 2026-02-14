import { defineStore } from 'pinia';
import type { AuthStore } from '../types';

export const useCatalogStore = defineStore('catalog-store', {
  state: (): AuthStore => ({
    accessToken: undefined
  }),
  actions: {
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken;
    },
    clearAccessToken() {
      this.accessToken = undefined;
    }
  }
});
