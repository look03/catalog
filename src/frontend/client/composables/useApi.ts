import type { ApiOptions, ApiResponse, Tokens } from '~/types';
import { useAuthModule } from '~/modules/auth/global';

const DEFAULT_API_OPTIONS: ApiOptions = {
  auth: true,
  retry: true
};

const MAX_RETRIES = 2;

export const refreshToken = async (): Promise<void> => {
  const config = useRuntimeConfig();
  const auth = useAuthModule();
  const response = await $fetch<ApiResponse<Tokens>>('/auth/refresh', {
    method: 'POST',
    baseURL: config.public.apiBase,
    credentials: 'include'
  });

  if (!response.data?.accessToken) {
    logError('USE_API', 'Failed to refresh token');
    throw new Error('REFRESH_FAILED');
  }

  auth.setToken(response.data.accessToken);
};

const handleApiError = async <T>(
  error: any,
  retry: () => Promise<T>,
  retryCount: number
): Promise<T> => {
  const auth = useAuthModule();

  const status = error?.response?.status;

  if (status === 401 && retryCount > 0) {
    try {
      await refreshToken();
      return await retry();
    } catch {
      auth.clearToken();
      navigateTo('/auth');
    }
  }

  if (status === 403) {
    showError({
      status: 403,
      statusText: error?.response?.message
    });
  }

  logError('USE_API', error);
  throw error;
};

const request = async <T>(
  url: string,
  options: any = {},
  params: any = {},
  apiOptions: ApiOptions = DEFAULT_API_OPTIONS,
  retryCount = MAX_RETRIES
): Promise<T> => {
  const config = useRuntimeConfig();
  const auth = useAuthModule();

  try {
    const response = await $fetch<ApiResponse<T>>(url, {
      baseURL: config.public.apiBase,
      query: params,
      credentials: 'include',
      ...options,
      headers: {
        ...(apiOptions.auth && auth.accessToken?.value
          ? { Authorization: `Bearer ${auth.accessToken.value}` }
          : {}),
        ...options.headers
      }
    });

    if (!response.success) {
      throw new Error('API_ERROR');
    }

    return response.data;
  } catch (error: any) {
    if (retryCount <= 0) {
      throw error;
    }

    return handleApiError<T>(
      error,
      () => request<T>(url, options, params, { ...apiOptions, retry: false }, retryCount - 1),
      retryCount - 1
    );
  }
};

export const useApi = {
  get: <T>(url: string, params = {}, opts = {}, apiOpts?: ApiOptions) =>
    request<T>(url, { method: 'GET', ...opts }, params, apiOpts),

  post: <T>(url: string, body?: any, params = {}, opts = {}, apiOpts?: ApiOptions) =>
    request<T>(url, { method: 'POST', body, ...opts }, params, apiOpts),

  patch: <T>(url: string, body?: any, params = {}, opts = {}, apiOpts?: ApiOptions) =>
    request<T>(url, { method: 'PATCH', body, ...opts }, params, apiOpts),

  delete: <T>(url: string, params = {}, opts = {}, apiOpts?: ApiOptions) =>
    request<T>(url, { method: 'DELETE', ...opts }, params, apiOpts)
};
