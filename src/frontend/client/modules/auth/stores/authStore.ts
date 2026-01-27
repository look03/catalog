import { defineStore } from 'pinia'
import type { AuthStore } from '../types'

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthStore => ({
    token: undefined,
  }),
  actions: {
    setToken(value: string) {
      this.token = value
    },
    clearToken() {
      this.token = undefined
    },
  },
})
