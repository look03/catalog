type ApiOptions = {
  auth?: boolean
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const { token, clearToken } = useAuth()

  const request = async <T>(
    url: string,
    options: any = {},
    apiOptions: ApiOptions = { auth: true }
  ): Promise<T> => {
    return $fetch<T>(url, {
      baseURL: config.public.apiBase,
      ...options,
      headers: {
        ...(apiOptions.auth && token.value
          ? { Authorization: `Bearer ${token.value}` }
          : {}),
        ...options.headers,
      },

      onResponseError({ response }) {
        if (response.status === 401) {
          clearToken()
          navigateTo('/login')
        }
      },
    })
  }

  return {
    get: <T>(url: string, opts = {}, apiOpts?: ApiOptions) =>
      request<T>(url, { method: 'GET', ...opts }, apiOpts),

    post: <T>(url: string, body?: any, opts = {}, apiOpts?: ApiOptions) =>
      request<T>(url, { method: 'POST', body, ...opts }, apiOpts),

    patch: <T>(url: string, body?: any, opts = {}, apiOpts?: ApiOptions) =>
      request<T>(url, { method: 'PATCH', body, ...opts }, apiOpts),

    delete: <T>(url: string, opts = {}, apiOpts?: ApiOptions) =>
      request<T>(url, { method: 'DELETE', ...opts }, apiOpts),
  }
}
