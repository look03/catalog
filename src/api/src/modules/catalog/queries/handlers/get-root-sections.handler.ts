import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { GetRootSectionsQuery } from '../impl/get-root-sections.query';
import { ElasticService } from '../../services/elastic.service';
import type { SearchSection } from '../../../../types/global.catalog';

export type CatalogRootSectionNav = {
  id: number;
  title: string;
  path: string;
};

@QueryHandler(GetRootSectionsQuery)
export class GetRootSectionsHandler implements IQueryHandler<GetRootSectionsQuery> {
  private readonly logger = new Logger(GetRootSectionsHandler.name);

  constructor(private readonly elasticService: ElasticService) {}

  async execute(): Promise<CatalogRootSectionNav[]> {
    try {
      const result = await this.elasticService.search<SearchSection>({
        size: 200,
        query: {
          bool: {
            filter: [{ term: { type: 'section' } }, { term: { active: true } }],
            must_not: [{ exists: { field: 'parent_section_id' } }],
          },
        },
      });

      const items = result.hits.hits.map((hit) => ({
        id: Number(hit._source.id),
        title: hit._source.title,
        path: hit._source.path,
      }));

      items.sort((a, b) => a.title.localeCompare(b.title, 'ru'));

      return items;
    } catch (error) {
      this.logger.warn(
        `Catalog root sections: ${error instanceof Error ? error.message : String(error)}`,
      );
      return [];
    }
  }
}
