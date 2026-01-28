import type { ApiOptions, ApiResponse, Tokens } from '~/types';
import { useAuthModule } from '~/modules/auth/global';
import type { RuntimeConfig } from 'nuxt/schema';

const refreshToken = async (
  config: RuntimeConfig,
  setToken: (token: string) => void
): Promise<void> => {
  const response = await $fetch<ApiResponse<Tokens>>('/auth/refresh', {
    method: 'POST',
    baseURL: config.public.apiBase,
    credentials: 'include'
  });

  if (response.data?.accessToken) {
    setToken(response.data.accessToken);
  } else {
    logError('USE_API', 'Failed to refresh token');
  }
};

const fetch = async <T>(
  url: string,
  options: any = {},
  params: any = {},
  apiOptions: ApiOptions = { auth: true }
): Promise<T> => {
  const config = useRuntimeConfig();
  const { accessToken, setToken, clearToken } = useAuthModule();

  const makeRequest = async () => {
    return await $fetch<ApiResponse<T>>(url, {
      baseURL: config.public.apiBase,
      query: params,
      ...options,
      headers: {
        ...(apiOptions.auth && accessToken?.value
          ? { Authorization: `Bearer ${accessToken.value}` }
          : {}),
        ...options.headers
      }
    });
  };

  try {
    const response = await makeRequest();

    if (!response.success) {
      throw new Error();
    }

    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      try {
        await refreshToken(config, setToken);
        const response = await makeRequest();
        return response.data;
      } catch {
        clearToken();
        navigateTo('/auth');
        logError('USE_API', error);
        throw error;
      }
    }
    logError('USE_API', error);
    throw error;
  }
};

export const useApi = {
  get: <T>(url: string, opts = {}, params = {}, apiOpts?: ApiOptions) =>
    fetch<T>(url, { method: 'GET', ...opts }, params, apiOpts),

  post: <T>(url: string, body?: any, opts = {}, params = {}, apiOpts?: ApiOptions) =>
    fetch<T>(url, { method: 'POST', body, ...opts }, params, apiOpts),

  patch: <T>(url: string, body?: any, opts = {}, params = {}, apiOpts?: ApiOptions) =>
    fetch<T>(url, { method: 'PATCH', body, ...opts }, params, apiOpts),

  delete: <T>(url: string, opts = {}, params = {}, apiOpts?: ApiOptions) =>
    fetch<T>(url, { method: 'DELETE', ...opts }, params, apiOpts)
};
