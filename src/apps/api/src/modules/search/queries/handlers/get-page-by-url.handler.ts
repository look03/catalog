import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { GetPageByUrlQuery } from '../impl/get-page-by-url.query';
import { ElasticService } from '../../services/elastic.service';
import { SearchDocument } from '../../types/document.types';

@QueryHandler(GetPageByUrlQuery)
export class GetPageByUrlHandler implements IQueryHandler<GetPageByUrlQuery> {
  constructor(private readonly elasticService: ElasticService) {}

  async execute({ url }: GetPageByUrlQuery): Promise<string> {
    if (url === '/catalog/') {
      return 'section';
    }

    const result = await this.elasticService.search<SearchDocument>({
      size: 1,
      query: {
        bool: {
          filter: [{ term: { paths: url } }, { term: { active: true } }],
        },
      },
    });

    if (!result.hits.hits.length) {
      throw new NotFoundException('No Hits Found');
    }

    return result.hits.hits[0]?._source?.type;
  }
}
