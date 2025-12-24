import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductsQuery } from '../impl/get-products.query';
import { CatalogProduct, Products } from '../../interfaces/product.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { formatDate } from '../../../../common/utils/date-format.util';
import { BasePaginationFilterHandler } from './base-pagination-filter.handler';

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

  private async getPagedIds(
    page: number,
    limit: number,
    nameFilter: string | undefined,
    sortColumn: string,
    sortDirection: 'ASC' | 'DESC',
  ): Promise<number[]> {
    const alias = 'p2';
    const adjustedSortColumn = sortColumn.replace('p', alias);

    const idsSubQuery = this.repo
      .createQueryBuilder(alias)
      .select(`${alias}.id`)
      .where(nameFilter ? `${alias}.title ILIKE :title` : '1=1', { title: `%${nameFilter}%` })
      .orderBy(adjustedSortColumn, sortDirection)
      .skip((page - 1) * limit)
      .take(limit);

    const idsResult = await idsSubQuery.getRawMany();

    return idsResult.map((r) => r.p2_id);
  }

  private async getProductsByIds(ids: number[], sortColumn: string, sortDirection: 'ASC' | 'DESC') {
    return this.repo
      .createQueryBuilder('p')
      .select(['p.id', 'p.title', 'p.price', 'p.code', 'p.created_at', 'p.updated_at'])
      .leftJoinAndSelect('p.productSections', 'productSections')
      .leftJoin('productSections.section', 'section')
      .addSelect(['section.path', 'section.title'])
      .where('p.id IN (:...ids)', { ids })
      .orderBy(sortColumn, sortDirection)
      .getMany();
  }

  private async getTotalCount(nameFilter: string | undefined): Promise<number> {
    const totalQuery = this.repo
      .createQueryBuilder('p')
      .leftJoin('p.productSections', 'productSections')
      .leftJoin('productSections.section', 'section')
      .where(nameFilter ? 'p.title ILIKE :title' : '1=1', { title: `%${nameFilter}%` });

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
        name: el.title,
        code: el.code,
        price: el.price,
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

  async execute(query: GetProductsQuery): Promise<Products> {
    try {
      const { page, limit, nameFilter, sort, order } = query;

      const sortBy = this.validateSortColumn(sort);
      const sortDirection = this.getSortDirection(order);
      const sortColumn = this.SORT_MAP[sortBy] ?? 'p.id';

      const ids = await this.getPagedIds(page, limit, nameFilter, sortColumn, sortDirection);

      if (ids.length === 0) {
        return {
          total: 0,
          items: null,
        };
      }

      const items = await this.getProductsByIds(ids, sortColumn, sortDirection);
      const totalCount = await this.getTotalCount(nameFilter);

      const formattedItems = this.formatProducts(items);

      return {
        total: totalCount,
        items: formattedItems.length > 0 ? formattedItems : null,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to get products',
        details: error.toString(),
      });
    }
  }
}
