import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSectionPageQuery } from '../impl/get-section-page.query';
import { ElasticService } from '../../services/elastic.service';
import {
  SearchDocument,
  SearchSections,
  SearchSort,
  SectionDocument,
} from '../../types/document.types';
import { NotFoundException } from '@nestjs/common';
import { SearchFilters, SearchSortOrder, Aggregations, Facet } from '../../types/document.types';
import {
  ElasticsearchRangeFilter,
  ElasticsearchTermsFilter,
  ElasticsearchFilter,
  ElasticsearchRange,
  ElasticSearchResult,
  ElasticSearchHitsResult,
} from '../../types/elastic-search.types';

@QueryHandler(GetSectionPageQuery)
export class GetSectionPageHandler implements IQueryHandler<GetSectionPageQuery> {
  constructor(private readonly elasticService: ElasticService) {}
  private MAX_ELASTIC_SIZE = 10000;

  private pushIfNotEmpty<T>(target: T[], items: T[] | null | undefined): void {
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        target.push(item);
      }
    }
  }

  private async getChildSectionsIds(url: string): Promise<string[]> {
    const result = await this.elasticService.search<SearchDocument>({
      size: this.MAX_ELASTIC_SIZE,
      query: {
        prefix: {
          'path.keyword': url,
        },
      },
    });

    if (!result.hits.hits.length) {
      throw new NotFoundException('No Hits Found');
    }

    return result.hits.hits.map((hit) => hit._source.id);
  }

  private async buildSectionFilters(url: string): Promise<ElasticsearchTermsFilter[]> {
    const sectionIds = await this.getChildSectionsIds(url);

    if (!sectionIds || sectionIds.length === 0) {
      return [];
    }

    return [
      {
        terms: {
          section_ids: sectionIds,
        },
      },
    ];
  }

  private buildPriceFilters(filters?: SearchFilters): ElasticsearchRangeFilter[] {
    if (!filters) {
      return [];
    }

    const priceRange: ElasticsearchRange = {};

    if (filters.priceFrom !== undefined) {
      priceRange.gte = filters.priceFrom;
    }

    if (filters.priceTo !== undefined) {
      priceRange.lte = filters.priceTo;
    }

    if (Object.keys(priceRange).length === 0) {
      return [];
    }

    return [
      {
        range: {
          price: priceRange,
        },
      },
    ];
  }

  private buildBrandFilters(filters?: SearchFilters): ElasticsearchTermsFilter[] {
    if (!filters?.brands?.length) {
      return [];
    }

    return [
      {
        terms: {
          'brand.code': filters.brands,
        },
      },
    ];
  }

  private async buildFilters(query: GetSectionPageQuery): Promise<ElasticsearchFilter[]> {
    const filters: ElasticsearchFilter[] = [{ term: { type: 'element' } }];

    if (query.url !== '/catalog/') {
      const sectionFilters = await this.buildSectionFilters(query.url);
      this.pushIfNotEmpty(filters, sectionFilters);
    }

    this.pushIfNotEmpty(filters, this.buildPriceFilters(query.filters));
    this.pushIfNotEmpty(filters, this.buildBrandFilters(query.filters));

    return filters;
  }

  private buildSort(
    sort: SearchSort = 'newest',
    order: SearchSortOrder = 'desc',
  ): Array<Record<string, 'asc' | 'desc'>> {
    const fieldMap: Record<SearchSort, string> = {
      price: 'price',
      newest: 'created_at',
    };

    const field = fieldMap[sort];

    return [{ [field]: order }];
  }

  private buildAggregations() {
    return {
      brands: {
        terms: {
          field: 'brand.code.keyword',
          size: 100,
        },
        aggs: {
          brand_sample: {
            top_hits: {
              size: 1,
              _source: ['brand'],
            },
          },
        },
      },
      price: {
        stats: {
          field: 'price',
        },
      },
    };
  }

  private formatFacets(aggregations: Aggregations | undefined): Facet[] | null {
    if (!aggregations) {
      return null;
    }

    const facets: Facet[] = [];
    if (aggregations.price) {
      facets.push({
        values: [aggregations.price.min ?? 0, aggregations.price.max ?? 0],
        title: 'Цена',
        key: 'price',
        sort: 1,
      });
    }

    if (aggregations.brands) {
      facets.push({
        key: 'brands',
        title: 'Бренд',
        sort: 2,
        values: aggregations.brands.buckets.map((bucket) => {
          const brandSource = bucket.brand_sample?.hits.hits[0]?._source?.brand || {};
          return {
            name: brandSource.name ?? bucket.key,
            code: brandSource.code ?? bucket.key,
            count: bucket.doc_count,
            searchCode: brandSource.code ?? bucket.key,
          };
        }),
      });
    }

    return facets;
  }

  private pickBestPath(paths: string[] | undefined, url: string): string {
    if (!paths || !paths.length) {
      return '';
    }

    const normalizedUrl = url.endsWith('/') ? url : `${url}/`;

    const matched = paths
      .filter((path) => normalizedUrl.startsWith(path))
      .sort((a, b) => b.length - a.length);

    return matched[0] ?? paths[0];
  }

  private formatProducts(
    products: ElasticSearchHitsResult<SearchDocument>,
    url: string,
  ): SectionDocument[] | null {
    if (!products) {
      return null;
    }

    return products.map((hit) => ({
      id: hit._source.id,
      title: hit._source.title,
      path: this.pickBestPath(hit._source.paths, url),
      price: hit._source.price,
      images: hit._source.images,
    }));
  }

  private formatResponse(result: ElasticSearchResult, query: GetSectionPageQuery): SearchSections {
    const response = {
      type: 'section',
      products: this.formatProducts(result.hits.hits, query.url),
      pagination: {
        page: query.page,
        limit: query.limit,
        total: result.hits.total.value,
      },
      facets: this.formatFacets(result.aggregations),
    };

    if (query.onlyFilter) {
      response.products = null;
    }

    return response;
  }

  async execute(query: GetSectionPageQuery): Promise<SearchSections> {
    const filters = await this.buildFilters(query);
    const sort = this.buildSort(query.sort, query.order);
    const aggs = this.buildAggregations();

    const result = await this.elasticService.search<SearchDocument>({
      from: (query.page - 1) * query.limit,
      size: query.limit,
      query: {
        bool: {
          filter: filters,
        },
      },
      sort,
      aggs,
    });

    return this.formatResponse(result, query);
  }
}
