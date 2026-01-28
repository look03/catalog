export async function getList(): Promise<void> {
  try {
    const response = await useApi.get<any>(
      '/admin/products',
      {},
      {
        page: 1,
        limit: 10,
        order: 'desc',
        sort: 'id'
      },
      { auth: true }
    );
  } catch (error) {
    logError('AUTH_LOGIN', 'GET', error);
  }
}
