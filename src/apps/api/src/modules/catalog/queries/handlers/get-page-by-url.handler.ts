import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GetPageByUrlQuery } from '../impl/get-page-by-url.query';
import { ElasticService } from '../../services/elastic.service';
import { SearchDocument } from '../../types/document.types';

@QueryHandler(GetPageByUrlQuery)
export class GetPageByUrlHandler implements IQueryHandler<GetPageByUrlQuery> {
  constructor(private readonly elasticService: ElasticService) {}

  /**
   * Определяет тип страницы по url: 'section' для /catalog/ или по документу в Elastic (paths, active).
   * @param query — запрос с url
   * @returns тип страницы: 'section' или 'element'
   */
  async execute({ url }: GetPageByUrlQuery): Promise<string> {
    if (!url) {
      throw new BadRequestException('Not URL');
    }

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
