import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductPageQuery } from '../impl/get-product-page.query';
import { ElasticService } from '../../services/elastic.service';
import { SearchDocument } from '../../types/document.types';

@QueryHandler(GetProductPageQuery)
export class GetProductPageHandler implements IQueryHandler<GetProductPageQuery> {
  constructor(private readonly elasticService: ElasticService) {}

  async execute({ url }: GetProductPageQuery) {
    const result = await this.elasticService.search<SearchDocument>({
      size: 1,
      query: {
        bool: {
          filter: [
            { term: { type: 'element' } },
            { term: { paths: url } },
            { term: { active: true } },
          ],
        },
      },
    });

    return {
      type: 'element',
      product: result.hits.hits[0]._source,
    };
  }
}
