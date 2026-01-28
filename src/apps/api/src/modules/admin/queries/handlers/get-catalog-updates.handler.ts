import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCatalogUpdatesQuery } from '../impl/get-catalog-updates.query';
import { IndexSearchService } from '../../services/index-search.service';
import { SearchSectionsAndProducts } from '../../../../types/global.catalog';

@QueryHandler(GetCatalogUpdatesQuery)
export class GetCatalogUpdatesHandler implements IQueryHandler<GetCatalogUpdatesQuery> {
  constructor(private readonly indexSearchService: IndexSearchService) {}

  async execute(query: GetCatalogUpdatesQuery): Promise<SearchSectionsAndProducts | null> {
    return this.indexSearchService.getIndexData(query.lastSync);
  }
}
