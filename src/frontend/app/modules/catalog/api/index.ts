export async function getCatalogData(path: string): Promise<void> {
  try {
    console.log(path, '<<<<<<<<<<<<<< url');
    const response = await useApi.get<any>(
      '/catalog/',
      {},
      {
        page: 1,
        limit: 10,
        url: path
      },
      { auth: false }
    );
    console.log(response, '<<<<<<<<<<<<<< response');
  } catch (error) {
    logError('CATALOG_DATA', 'GET', error);
  }
}
