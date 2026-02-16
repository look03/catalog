import { AdminFilters } from '../../interfaces/products-and-sections.interfaces';

export class BasePaginationFilterQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly sort: string = 'id',
    public readonly order: 'asc' | 'desc' = 'desc',
    public readonly filters?: AdminFilters,
  ) {}
}
