import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductPageQuery } from '../impl/get-product-page.query';
import { ElasticService } from '../../services/elastic.service';
import { ProductDocument, SearchDocument } from '../../types/document.types';
import { ElasticsearchFilter, ElasticSearchHitsResult } from '../../types/elastic-search.types';
import { formatDate } from '../../../../common/utils/date-format.util';
import { ParentSectionFormat } from '../../../../types/global.catalog';

@QueryHandler(GetProductPageQuery)
export class GetProductPageHandler implements IQueryHandler<GetProductPageQuery> {
  constructor(private readonly elasticService: ElasticService) {}

  private pickPath(paths: string[] | undefined, url: string): string {
    if (!paths?.length) {
      return '';
    }

    return paths.find((path) => path === url) ?? '';
  }

  private pickParentSectionFormat(
    parentSections: ParentSectionFormat[] | undefined,
    url: string,
  ): ParentSectionFormat | null {
    console.log(parentSections, '<<<<<<<<<<<<<< parentSections');
    if (!parentSections?.length) {
      return null;
    }

    const normalizedUrl = url.endsWith('/') ? url : `${url}/`;

    // Фильтруем те, у которых path — префикс url
    const candidates = parentSections
      .filter((ps) => normalizedUrl.startsWith(ps.path))
      .sort((a, b) => b.path.length - a.path.length); // сортируем по длине path (убывание)

    return candidates[0] ?? parentSections[0];
  }

  private formatProduct(
    products: ElasticSearchHitsResult<SearchDocument>,
    url: string,
  ): ProductDocument[] | null {
    if (!products) {
      return null;
    }

    return products.map((hit) => ({
      id: hit._source.id,
      title: hit._source.title,
      path: this.pickPath(hit._source.paths, url),
      price: hit._source.price,
      images: hit._source.images,
      color: hit._source.color,
      preview_text: hit._source.preview_text,
      created_at: formatDate(hit._source.created_at),
      updated_at: formatDate(hit._source.updated_at),
      parent_section_format: this.pickParentSectionFormat(hit._source?.parent_sections_format, url),
    }));
  }

  private buildProductFilters(url: string): ElasticsearchFilter[] {
    return [{ term: { type: 'element' } }, { term: { paths: url } }];
  }

  async execute({ url }: GetProductPageQuery) {
    const result = await this.elasticService.search<SearchDocument>({
      size: 1,
      query: {
        bool: {
          filter: this.buildProductFilters(url),
        },
      },
    });

    return {
      type: 'element',
      products: this.formatProduct(result.hits.hits, url),
    };
  }
}
