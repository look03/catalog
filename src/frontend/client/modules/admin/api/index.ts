export async function getList(): Promise<void> {
  try {
    // const response = await useApi.get<any>(
    //   '/admin/products',
    //   {},
    //   {
    //     page: 1,
    //     limit: 10,
    //     order: 'desc',
    //     sort: 'id'
    //   },
    //   { auth: true }
    // );
    // console.log(response, '<<<<<<<<<<<<<< response');
  } catch (error) {
    logError('ADMIN_GET_LIST', 'GET', error);
  }
}
