import type { ProductsResponse, SectionsResponse } from '../types';
import { useAdminStore } from '../stores/adminStore';
import type { User } from '~/types';
import { isNotEmptyObject } from '~/utils/object.operations';

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
    console.log(adminStore.filters, '<<<<<<<<<<<<<< adminStore.filters');
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
