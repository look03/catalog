import type { ProductsResponse, SectionsResponse, Sort } from '../types';
import { useAdminStore } from '../stores/adminStore';
import type { User } from '~/types';
import { isNotEmptyObject } from '~/utils/object.operations';
import { useApi } from '~/composables/useApi';
import { useAuthModule } from '~/modules/auth/global';

export type BrandOption = { id: number; name: string };
export type SectionOption = { id: number; name: string; parent_section?: { id: number } | null };

export async function getListProducts(adminStore: ReturnType<typeof useAdminStore>): Promise<void> {
  try {
    const response = await useApi.get<ProductsResponse>(
      '/admin/products',
      {
        page: adminStore.page,
        limit: adminStore.limit,
        order: adminStore.order,
        sort: adminStore.sort,
        filters: JSON.stringify(adminStore.filters)
      },
      {},
      { auth: true }
    );

    adminStore.setProductsData(response);
  } catch (error) {
    logError('ADMIN_GET_LIST_PRODUCTS', 'GET', error);
  }
}

export async function getListSections(adminStore: ReturnType<typeof useAdminStore>): Promise<void> {
  try {
    const response = await useApi.get<SectionsResponse>(
      '/admin/sections',
      {
        page: adminStore.page,
        limit: adminStore.limit,
        order: adminStore.order,
        sort: adminStore.sort,
        filters: JSON.stringify(adminStore.filters)
      },
      {},
      { auth: true }
    );

    adminStore.setSectionsData(response);
  } catch (error) {
    logError('ADMIN_GET_LIST_SECTIONS', 'GET', error);
  }
}

export async function getList(): Promise<void> {
  const adminStore = useAdminStore();
  const { tableType } = storeToRefs(adminStore);

  if (tableType.value === 'products') {
    await getListProducts(adminStore);
  } else {
    await getListSections(adminStore);
  }
}

export async function deleteProduct(
  id: number,
  adminStore: ReturnType<typeof useAdminStore>
): Promise<void> {
  try {
    const response = await useApi.delete<ProductsResponse>(
      `/admin/product/${id}/`,
      {
        page: adminStore.page,
        limit: adminStore.limit,
        order: adminStore.order,
        sort: adminStore.sort,
        filters: JSON.stringify(adminStore.filters)
      },
      {},
      { auth: true }
    );

    adminStore.setProductsData(response);
  } catch (error) {
    logError('ADMIN_GET_LIST_SECTIONS', 'GET', error);
  }
}

export async function deleteSection(
  id: number,
  adminStore: ReturnType<typeof useAdminStore>
): Promise<void> {
  try {
    const response = await useApi.delete<SectionsResponse>(
      `/admin/section/${id}/`,
      {
        page: adminStore.page,
        limit: adminStore.limit,
        order: adminStore.order,
        sort: adminStore.sort,
        filters: JSON.stringify(adminStore.filters)
      },
      {},
      { auth: true }
    );

    adminStore.setSectionsData(response);
  } catch (error) {
    logError('ADMIN_GET_LIST_SECTIONS', 'GET', error);
  }
}

export async function deleteRow(id: number): Promise<void> {
  const adminStore = useAdminStore();
  const { tableType } = storeToRefs(adminStore);

  if (tableType.value === 'products') {
    await deleteProduct(id, adminStore);
  } else {
    await deleteSection(id, adminStore);
  }
}

export async function getUserData(): Promise<void> {
  try {
    const appStore = useAppStore();

    const response = await useApi.get<User>('/admin/user', {}, {}, { auth: true });

    if (isNotEmptyObject(response)) {
      appStore.setUserData(response);
    }
  } catch (error) {
    logError('ADMIN_GET_USER_DATA', 'GET', error);
  }
}

export async function getBrands(): Promise<BrandOption[]> {
  try {
    const data = await useApi.get<BrandOption[]>('/admin/brands/', {}, {}, { auth: true });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    logError('ADMIN_GET_BRANDS', 'GET', error);
    return [];
  }
}

export async function getSectionsForSelect(): Promise<SectionOption[]> {
  try {
    const response = await useApi.get<SectionsResponse>(
      '/admin/sections',
      { page: 1, limit: 500, order: 'asc', sort: 'id', filters: '{}' },
      {},
      { auth: true }
    );
    const items = response?.items ?? [];
    return items.map((s) => ({ id: s.id, name: s.name, parent_section: null }));
  } catch (error) {
    logError('ADMIN_GET_SECTIONS_FOR_SELECT', 'GET', error);
    return [];
  }
}

export async function createSection(payload: {
  title: string;
  parent_section_id?: number;
}): Promise<void> {
  const adminStore = useAdminStore();
  adminStore.setLoadingForm(true);
  adminStore.setAddElementTableOptions();
  try {
    const response = await useApi.post<SectionsResponse>(
      '/admin/section/',
      payload,
      {
        sort: adminStore.sort,
        order: adminStore.order,
        limit: adminStore.limit,
        page: adminStore.page
      },
      {},
      { auth: true }
    );

    adminStore.setSectionsData(response);
  } catch (err) {
    logError('ADMIN_CREATE_SECTION', 'POST', err);
  } finally {
    adminStore.resetFormLoading();
  }
}

export async function createProduct(formData: FormData): Promise<void> {
  const config = useRuntimeConfig();
  const auth = useAuthModule();
  const response = await $fetch<{ success: boolean; data?: unknown }>(
    `${config.public.apiBase}/admin/product/`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: auth.accessToken?.value ? { Authorization: `Bearer ${auth.accessToken.value}` } : {}
    }
  );
  if (!response?.success) {
    throw new Error('API_ERROR');
  }
}
