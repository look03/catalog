export abstract class BasePaginationFilterHandler {
  protected readonly allowedSortColumns = ['id', 'title', 'createdAt'];

  protected readonly SORT_MAP: Record<string, string> = {
    id: 'p.id',
    title: 'p.title',
    code: 'p.code',
    created_at: 'p.created_at',
  };

  protected validateSortColumn(sort?: string): string {
    if (!sort || !this.allowedSortColumns.includes(sort)) {
      return 'id';
    }
    return sort;
  }

  protected getSortDirection(order?: string): 'ASC' | 'DESC' {
    return order?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  }
}
