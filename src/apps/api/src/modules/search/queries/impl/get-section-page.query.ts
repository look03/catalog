import { CatalogFiltersDto } from '../../dto/catalog-filters.dto';

export class GetSectionPageQuery {
  constructor(
    public readonly url: string,
    public readonly page: number = 1,
    public readonly limit: number = 24,
    public readonly filters?: CatalogFiltersDto,
    public readonly sort?: 'price_asc' | 'price_desc' | 'newest',
  ) {}
}
