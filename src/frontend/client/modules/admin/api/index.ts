export async function getList() {
  try {
    const response = await useApi.get<any>(
      '/catalog/products',
      {
        page: 1,
        limit: 10,
        order: 'desc',
        sort: 'id'
      },
      { auth: true }
    );
    console.log(response, '<<<<<<<<<<<<<< response');
  } catch (error) {
    logError('AUTH_LOGIN', 'GET', error);
  }
}
