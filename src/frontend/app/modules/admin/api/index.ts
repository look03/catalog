import type { ProductsResponse } from '../types';
import { useAdminStore } from '../stores/adminStore';

export async function getList(): Promise<void> {
  try {
    const adminStore = useAdminStore();
    console.log(adminStore.limit, '<<<<<<<<<<<<<< adminStore.limit');
    const response = await useApi.get<ProductsResponse>(
      '/admin/products',
      {
        page: adminStore.page,
        limit: adminStore.limit,
        order: adminStore.order,
        sort: adminStore.sort
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
