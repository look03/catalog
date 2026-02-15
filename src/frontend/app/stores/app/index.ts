import { defineStore } from 'pinia';
import type { AppState } from './types';
import type { User } from '~/types';

export const useAppStore = defineStore('app-store', {
  state: (): AppState => ({
    user: {
      email: undefined,
    }
  }),
  actions: {
    setUserData(userData: User) {
      this.user = userData;
    },
  }
});
