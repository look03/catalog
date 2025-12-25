import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSectionPageQuery } from '../impl/get-section-page.query';
import { ElasticService } from '../../services/elastic.service';
import { SearchDocument } from '../../types/document.types';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetSectionPageQuery)
export class GetSectionPageHandler implements IQueryHandler<GetSectionPageQuery> {
  constructor(private readonly elasticService: ElasticService) {}

  private async getChildSectionsIds(url: string): Promise<string[]> {
    const result = await this.elasticService.search<SearchDocument>({
      size: 10000,
      query: {
        prefix: {
          'path.keyword': url,
        },
      },
    });

    if (!result.hits.hits.length) {
      throw new NotFoundException('No Hits Found');
    }

    // Все разделы — текущий + потомки
    return result.hits.hits.map((hit) => hit._source.id);
  }

  async execute(query: GetSectionPageQuery) {
    const filters: any[] = [{ term: { type: 'element' } }];

    if (query.url !== '/catalog/') {
      const sectionIds = await this.getChildSectionsIds(query.url);
      filters.push({ terms: { section_ids: sectionIds } });
    }

    if (query.filters?.priceFrom || query.filters?.priceTo) {
      filters.push({
        range: {
          price: {
            gte: query.filters.priceFrom,
            lte: query.filters.priceTo,
          },
        },
      });
    }

    if (query.filters?.brands?.length) {
      filters.push({
        terms: { brand: query.filters.brands },
      });
    }

    const sortMap = {
      price_asc: [{ price: 'asc' as const }],
      price_desc: [{ price: 'desc' as const }],
      newest: [{ created_at: 'desc' as const }],
    };

    const result = await this.elasticService.search<SearchDocument>({
      from: (query.page - 1) * query.limit,
      size: query.limit,
      query: { bool: { filter: filters } },
      sort: sortMap[query.sort ?? 'newest'],
      aggs: {
        // brands: { terms: { field: 'brand', size: 50 } },
        price: { stats: { field: 'price' } },
      },
    });

    return {
      type: 'section',
      products: result.hits.hits.map((h) => h._source),
      pagination: {
        page: query.page,
        limit: query.limit,
        total: result.hits.total.value,
      },
      facets: {
        brands: result.aggregations?.brands?.buckets ?? [],
        price: result.aggregations?.price ?? {},
      },
    };
  }
}
