import type { ApiOptions, ApiResponse, Tokens } from '~/types';
import { useAuthModule } from '~/modules/auth/global';

const DEFAULT_API_OPTIONS: ApiOptions = {
  auth: true,
  retry: true
};

const MAX_RETRIES = 2;

export async function redirectToAuth() {
  if (import.meta.server) {
    return navigateTo('/auth/', { replace: true });
  }
  await useNuxtApp().runWithContext(async () => {
    await nextTick();
    return useRouter().replace('/auth/');
  });
}

export const refreshToken = async (): Promise<void> => {
  const config = useRuntimeConfig();
  const auth = useAuthModule();

  const headers: HeadersInit = {};
  if (import.meta.server) {
    const reqHeaders = useRequestHeaders(['cookie']);
    if (reqHeaders.cookie) {
      headers.Cookie = reqHeaders.cookie;
    }
  }

  try {
    const response = await $fetch<ApiResponse<Tokens>>('/auth/refresh', {
      method: 'POST',
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers
    });

    if (!response.data?.accessToken) {
      logError('USE_API', 'Failed to refresh token');
      throw new Error('REFRESH_FAILED');
    }

    auth.setToken(response.data.accessToken);
  } catch (err: unknown) {
    if ((err as { statusCode?: number })?.statusCode === 401) {
      auth.clearUserInfo();
    }
    throw err;
  }
};

type FetchError = {
  statusCode?: number;
  data?: unknown;
  response?: { status?: number; data?: unknown; message?: string };
};

const handleApiError = async <T>(
  error: unknown,
  retry: () => Promise<T>,
  retryCount: number
): Promise<T> => {
  const auth = useAuthModule();
  const e = error as FetchError;
  // ofetch/Nuxt даёт statusCode и data; axios — response.status и response.data
  const status = e?.statusCode ?? e?.response?.status;
  const body = e?.data ?? e?.response?.data;

  if (status === 401 && retryCount > 0) {
    try {
      await refreshToken();
      return await retry();
    } catch {
      auth.clearUserInfo();
      await redirectToAuth();
      return undefined as T;
    }
  }

  if (status === 403) {
    const message = (body as { message?: string })?.message ?? e?.response?.message ?? 'Forbidden';
    showError({
      status: 403,
      statusText: message
    });
  }

  logError('USE_API', String(error));

  throw error;
};

const request = async <T>(
  url: string,
  options: Record<string, unknown> = {},
  params: Record<string, unknown> = {},
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
        ...(options.headers &&
        typeof options.headers === 'object' &&
        !Array.isArray(options.headers)
          ? options.headers
          : {})
      }
    });

    if (!response.success) {
      throw new Error('API_ERROR');
    }

    return response.data;
  } catch (error: unknown) {
    if (retryCount <= 0 || !apiOptions.auth) {
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

  post: <T>(url: string, body?: unknown, params = {}, opts = {}, apiOpts?: ApiOptions) =>
    request<T>(url, { method: 'POST', body, ...opts }, params, apiOpts),

  patch: <T>(url: string, body?: unknown, params = {}, opts = {}, apiOpts?: ApiOptions) =>
    request<T>(url, { method: 'PATCH', body, ...opts }, params, apiOpts),

  delete: <T>(url: string, params = {}, opts = {}, apiOpts?: ApiOptions) =>
    request<T>(url, { method: 'DELETE', ...opts }, params, apiOpts)
};
