import type { ProductForm, ProductsResponse, SectionForm, SectionsResponse } from '../types';
import { useAdminStore } from '../stores/adminStore';
import type { User } from '~/types';
import { isNotEmptyObject } from '~/utils/object.operations';
import { useApi } from '~/composables/useApi';

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

export async function createSection(payload: SectionForm): Promise<void> {
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
    adminStore.clearSectionForm();
  } catch (err) {
    logError('ADMIN_CREATE_SECTION', 'POST', err);
  } finally {
    adminStore.resetFormLoading();
  }
}

export async function openEditFormSection(
  id: number,
  adminStore: ReturnType<typeof useAdminStore>
): Promise<void> {
  try {
    const response = await useApi.get<SectionForm>(`/admin/section/${id}/`, {}, {}, { auth: true });

    adminStore.clearSectionForm();
    adminStore.setSectionFormValues(response);
    adminStore.setEditIdNumber(id);
    adminStore.setOpenActionsAside(true);
  } catch (error) {
    logError('ADMIN_GET_SECTION_BY_ID', 'GET', error);
  }
}

export async function openEditFormProduct(
  id: number,
  adminStore: ReturnType<typeof useAdminStore>
): Promise<void> {
  try {
    const response = await useApi.get<ProductForm>(`/admin/product/${id}/`, {}, {}, { auth: true });

    adminStore.clearProductForm();
    adminStore.setProductFormValues(response);
    adminStore.setEditIdNumber(id);
    adminStore.setOpenActionsAside(true);
  } catch (error) {
    logError('ADMIN_GET_PRODUCT_BY_ID', 'GET', error);
  }
}

export async function openEditForm(id: number): Promise<void> {
  const adminStore = useAdminStore();
  const { tableType } = storeToRefs(adminStore);

  if (tableType.value === 'products') {
    await openEditFormProduct(id, adminStore);
  } else {
    await openEditFormSection(id, adminStore);
  }
}

export async function updateSection(id: number, payload: SectionForm): Promise<void> {
  const adminStore = useAdminStore();
  adminStore.setLoadingForm(true);
  try {
    const response = await useApi.patch<SectionsResponse>(
      `/admin/section/${id}/`,
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
    adminStore.clearSectionForm();
  } catch (err) {
    logError('ADMIN_UPDATE_SECTION', 'PATCH', err);
  } finally {
    adminStore.resetFormLoading();
  }
}

function buildProductFormData(payload: ProductForm): FormData {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('price', String(payload.price));
  formData.append('section_ids', JSON.stringify(payload.section_ids));
  if (payload.color) {
    formData.append('color', payload.color);
  }
  if (payload.preview_text) {
    formData.append('preview_text', payload.preview_text);
  }
  if (payload.brand_id != null && payload.brand_id > 0) {
    formData.append('brand_id', String(payload.brand_id));
  }
  if ('active' in payload && payload.active !== undefined) {
    formData.append('active', String(payload.active));
  }
  if ('image_ids_to_remove' in payload && payload.image_ids_to_remove?.length) {
    formData.append('image_ids_to_remove', JSON.stringify(payload.image_ids_to_remove));
  }
  if (payload.files?.length) {
    payload.files.forEach((file) => formData.append('images', file));
  }
  return formData;
}

export async function createProduct(payload: ProductForm): Promise<void> {
  const adminStore = useAdminStore();
  adminStore.setLoadingForm(true);
  adminStore.setAddElementTableOptions();
  try {
    const formData = buildProductFormData(payload);
    const response = await useApi.post<ProductsResponse>(
      '/admin/product/',
      formData,
      {
        sort: adminStore.sort,
        order: adminStore.order,
        limit: adminStore.limit,
        page: adminStore.page
      },
      {},
      { auth: true }
    );

    adminStore.setProductsData(response);
    adminStore.clearProductForm();
  } catch (err) {
    logError('ADMIN_CREATE_PRODUCT', 'POST', err);
  } finally {
    adminStore.resetFormLoading();
  }
}

export async function updateProduct(id: number, payload: ProductForm): Promise<void> {
  const adminStore = useAdminStore();
  adminStore.setLoadingForm(true);
  try {
    const formData = buildProductFormData(payload);
    await useApi.patch<ProductsResponse>(`/admin/product/${id}/`, formData, {}, { auth: true });

    adminStore.clearProductForm();
    await getListProducts(adminStore);
  } catch (err) {
    logError('ADMIN_UPDATE_PRODUCT', 'PATCH', err);
  } finally {
    adminStore.resetFormLoading();
  }
}
