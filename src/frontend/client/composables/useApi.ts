import { defu } from 'defu'

export const useApiToken = () => {
  const config = useRuntimeConfig()

  const ssrHeaders = import.dev.server
    ? useRequestHeaders(['cookie', 'authorization'])
    : {}

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',
    headers: ssrHeaders,

    async onRequest({ options }) {
      const token = useCookie('access_token').value

      options.headers = defu(options.headers as HeadersInit, {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      })
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        if (process.client) {
          navigateTo('/auth')
        } else {
          throw createError({ statusCode: 401 })
        }
      }
    },
  })

  return api
}
