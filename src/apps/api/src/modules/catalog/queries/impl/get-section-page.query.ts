import { CatalogFiltersDto } from '../../dto/catalog-filters.dto';
import { SearchSort, SearchSortOrder } from '../../types/document.types';

export class GetSectionPageQuery {
  constructor(
    public readonly url: string,
    public readonly page: number = 1,
    public readonly limit: number = 24,
    public readonly filters?: CatalogFiltersDto,
    public readonly sort?: SearchSort,
    public readonly order?: SearchSortOrder,
    public readonly onlyFilter?: boolean,
  ) {}
}
