export abstract class BasePaginationFilterHandler {
  protected readonly allowedSortColumns = ['id', 'title', 'createdAt'];

  protected readonly SORT_MAP: Record<string, string> = {
    id: 'p.id',
    title: 'p.title',
    code: 'p.code',
    created_at: 'p.created_at',
  };

  /**
   * Проверяет и возвращает допустимую колонку сортировки или 'id' по умолчанию.
   * @param sort — имя колонки (опционально)
   * @returns допустимая колонка
   */
  protected validateSortColumn(sort?: string): string {
    if (!sort || !this.allowedSortColumns.includes(sort)) {
      return 'id';
    }
    return sort;
  }

  /**
   * Возвращает направление сортировки: 'DESC' при order === 'desc', иначе 'ASC'.
   * @param order — направление (опционально)
   * @returns 'ASC' или 'DESC'
   */
  protected getSortDirection(order?: string): 'ASC' | 'DESC' {
    return order?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  }
}
