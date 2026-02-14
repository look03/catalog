import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCatalogUpdatesQuery } from '../impl/get-catalog-updates.query';
import { IndexSearchService } from '../../services/index-search.service';
import { SearchSectionsAndProducts } from '../../../../types/global.catalog';

@QueryHandler(GetCatalogUpdatesQuery)
export class GetCatalogUpdatesHandler implements IQueryHandler<GetCatalogUpdatesQuery> {
  constructor(private readonly indexSearchService: IndexSearchService) {}

  /**
   * Возвращает данные каталога (секции и продукты), обновлённые после lastSync.
   * @param query — запрос с датой lastSync
   * @returns секции и продукты для синхронизации или null
   */
  async execute(query: GetCatalogUpdatesQuery): Promise<SearchSectionsAndProducts | null> {
    return this.indexSearchService.getIndexData(query.lastSync);
  }
}
