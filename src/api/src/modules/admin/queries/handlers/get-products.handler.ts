import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductsQuery } from '../impl/get-products.query';
import {
  CatalogProduct,
  IdResultItem,
  ProductHeaders,
  Products,
} from '../../interfaces/product.interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { formatDate } from '../../../../common/utils/date-format.util';
import { BasePaginationFilterHandler } from './base-pagination-filter.handler';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';
import { AdminFilters } from '../../interfaces/products-and-sections.interfaces';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler
  extends BasePaginationFilterHandler
  implements IQueryHandler<GetProductsQuery>
{
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {
    super();
  }

  private readonly logger = new Logger('GetProductsHandler');

  private buildWhereParams(alias: string, filters?: AdminFilters) {
    const conditions: string[] = [];
    const whereParams: Record<string, string | number | boolean> = {};
    if (filters?.name) {
      conditions.push(`${alias}.title ILIKE :title`);
      whereParams.title = `%${filters.name}%`;
    }

    if (filters?.code) {
      conditions.push(`${alias}.code ILIKE :code`);
      whereParams.code = `%${filters.code}%`;
    }
    if (filters?.id != null) {
      conditions.push(`${alias}.id = :id`);
      whereParams.id = filters.id;
    }

    if (filters?.active != null) {
      conditions.push(`${alias}.active = :active`);
      whereParams.active = filters.active;
    }

    return { where: conditions.length ? conditions.join(' AND ') : '1=1', params: whereParams };
  }

  private async getPagedIds(
    page: number,
    limit: number,
    sortColumn: string,
    sortDirection: 'ASC' | 'DESC',
    filters?: AdminFilters,
  ): Promise<string[]> {
    const alias = 'p2';
    const adjustedSortColumn = sortColumn.replace('p', alias);
    const { where, params } = this.buildWhereParams(alias, filters);

    const idsSubQuery = this.repo
      .createQueryBuilder(alias)
      .select(`${alias}.id`)
      .where(where, params)
      .orderBy(adjustedSortColumn, sortDirection)
      .skip((page - 1) * limit)
      .take(limit);

    const idsResult: IdResultItem[] = await idsSubQuery.getRawMany();

    return idsResult.map((r) => r.p2_id);
  }

  private async getProductsByIds(ids: string[], sortColumn: string, sortDirection: 'ASC' | 'DESC') {
    return this.repo
      .createQueryBuilder('p')
      .select(['p.id', 'p.active', 'p.title', 'p.price', 'p.code', 'p.created_at', 'p.updated_at'])
      .leftJoinAndSelect('p.productSections', 'productSections')
      .leftJoin('productSections.section', 'section')
      .addSelect(['section.path', 'section.title'])
      .where('p.id IN (:...ids)', { ids })
      .orderBy(sortColumn, sortDirection)
      .getMany();
  }

  private async getTotalCount(filters?: AdminFilters): Promise<number> {
    const { where, params } = this.buildWhereParams('p', filters);

    const totalQuery = this.repo
      .createQueryBuilder('p')
      .leftJoin('p.productSections', 'productSections')
      .leftJoin('productSections.section', 'section')
      .where(where, params);

    const totalRaw = await totalQuery
      .select('COUNT(DISTINCT p.id)', 'count')
      .getRawOne<{ count: string }>();
    return totalRaw ? parseInt(totalRaw.count, 10) : 0;
  }

  private formatProducts(items: Product[]): CatalogProduct[] {
    return items.map((el) => {
      const paths = el.productSections.map((ps) => `${ps.section.path}${el.code}/`);

      return {
        id: el.id,
        active: el.active,
        name: el.title,
        code: el.code,
        price: `${el.price} ₽`,
        createdAt: formatDate(el.created_at),
        updatedAt: formatDate(el.updated_at),
        paths,
        sections: el.productSections.map((ps) => ({
          name: ps.section.title,
          path: ps.section.path,
          pathDetail: `${ps.section.path}${el.code}/`,
        })),
      };
    });
  }

  getProductsHeaders(): ProductHeaders {
    return {
      id: 'Ид',
      active: 'Активность',
      name: 'Наименование товара',
      code: 'Код товара',
      price: 'Цена товара',
      sections: 'Категории',
      paths: 'Детальная страница',
      createdAt: 'Дата добавления',
      updatedAt: 'Дата обновления',
    };
  }

  /**
   * Возвращает список продуктов с пагинацией, фильтром по имени и сортировкой.
   * @param query — параметры запроса (page, limit, nameFilter, sort, order)
   * @returns список продуктов с общим количеством
   */
  async execute(query: GetProductsQuery): Promise<Products> {
    try {
      const { page, limit, sort, order, filters } = query;

      const sortBy = this.validateSortColumn(sort);
      const sortDirection = this.getSortDirection(order);
      const sortColumn = this.SORT_MAP[sortBy] ?? 'p.id';

      const ids = await this.getPagedIds(page, limit, sortColumn, sortDirection, filters);

      if (ids.length === 0) {
        return {
          total: 0,
          items: null,
          headers: null,
        };
      }

      const items = await this.getProductsByIds(ids, sortColumn, sortDirection);
      const totalCount = await this.getTotalCount(filters);

      const formattedItems = this.formatProducts(items);

      return {
        total: totalCount,
        items: formattedItems.length > 0 ? formattedItems : null,
        headers: this.getProductsHeaders(),
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to get products',
        details: getDetailsErrorUtil(error),
      });
    }
  }
}
