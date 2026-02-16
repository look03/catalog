import type { ProductsResponse } from '../types';
import { useAdminStore } from '../stores/adminStore';
import type { User } from '~/types';
import { isNotEmptyObject } from '~/utils/object.operations';

export async function getList(): Promise<void> {
  try {
    const adminStore = useAdminStore();

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

    if (response?.items && response.items?.length > 0) {
      adminStore.setProductsData(response);
    }
  } catch (error) {
    logError('ADMIN_GET_LIST', 'GET', error);
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
