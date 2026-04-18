import { Controller, Get, Query } from '@nestjs/common';
import { CatalogPageQueryDto } from './dto/catalog-page-query.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { GetPageByUrlQuery } from './queries/impl/get-page-by-url.query';
import { GetSectionPageQuery } from './queries/impl/get-section-page.query';
import { GetProductPageQuery } from './queries/impl/get-product-page.query';
import { GetRootSectionsQuery } from './queries/impl/get-root-sections.query';
import { ParseJsonPipe } from '../../common/pipes/parse-json.pipe';
import { CatalogFiltersDto } from './dto/catalog-filters.dto';
import { SearchProducts, SearchSections } from './types/document.types';
import type { CatalogRootSectionNav } from './queries/handlers/get-root-sections.handler';

@ApiTags('search')
@Controller('catalog/')
export class CatalogController {
  constructor(private readonly queryBus: QueryBus) {}

  /**
   * По url определяет тип страницы (section/element) и возвращает данные секции с фильтрами или карточку продукта.
   * @param query — параметры запроса (url, page, limit, sort, order, onlyFilter)
   * @param filter — фильтры (цена, бренды)
   * @returns данные секции (продукты, фасеты, пагинация) или страницы продукта
   */
  @Get('/')
  @ApiOperation({ summary: 'Получить товары или секции' })
  async getCatalogPage(
    @Query() query: Omit<CatalogPageQueryDto, 'filter'>,
    @Query('filter', ParseJsonPipe) filter: CatalogFiltersDto,
  ): Promise<SearchProducts | SearchSections> {
    const type: string = await this.queryBus.execute(new GetPageByUrlQuery(query.url));

    if (type === 'section') {
      return this.queryBus.execute(
        new GetSectionPageQuery(
          query.url,
          query.page,
          query.limit,
          filter,
          query.sort,
          query.order,
          query.onlyFilter,
        ),
      );
    }

    return this.queryBus.execute(new GetProductPageQuery(query.url));
  }

  /**
   * Корневые разделы каталога для навигации (меню витрины).
   */
  @Get('sections/root')
  @ApiOperation({ summary: 'Корневые разделы каталога (навигация)' })
  async getRootSections(): Promise<{ items: CatalogRootSectionNav[] }> {
    return await this.queryBus.execute(new GetRootSectionsQuery());
  }
}
