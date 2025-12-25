import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  UploadedFiles,
  Query,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { CatalogPageQueryDto } from './dto/catalog-page-query.dto';
import { ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { GetPageByUrlQuery } from './queries/impl/get-page-by-url.query';
import { GetSectionPageQuery } from './queries/impl/get-section-page.query';
import { GetProductPageQuery } from './queries/impl/get-product-page.query';
import { ParseJsonPipe } from '../../common/pipes/parse-json.pipe';
import { CatalogFiltersDto } from './dto/catalog-filters.dto';

@ApiTags('search')
@Controller('search/')
export class SearchController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/')
  async getCatalogPage(
    @Query('filter', ParseJsonPipe) filter: CatalogFiltersDto,
    @Query() query: Omit<CatalogPageQueryDto, 'filter'>,
  ): Promise<any> {
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
}
