import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSectionsQuery } from '../impl/get-sections.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from '../../entities/section.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { formatDate } from '../../../../common/utils/date-format.util';
import { BasePaginationFilterHandler } from './base-pagination-filter.handler';
import { CatalogSection, SectionHeaders, Sections } from '../../interfaces/section.interfaces';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';
import { ProductHeaders } from '../../interfaces/product.interfaces';
import { AdminFilters } from '../../interfaces/products-and-sections.interfaces';

@QueryHandler(GetSectionsQuery)
export class GetSectionsHandler
  extends BasePaginationFilterHandler
  implements IQueryHandler<GetSectionsQuery>
{
  constructor(
    @InjectRepository(Section)
    private readonly repo: Repository<Section>,
  ) {
    super();
  }

  private readonly logger = new Logger('GetSectionsHandler');

  private formatSections(items: Section[]): CatalogSection[] {
    return items.map((el) => {
      return {
        id: el.id,
        name: el.title,
        code: el.code,
        parentSectionId: el.parent_section?.id || null,
        parentSection: el.parent_section
          ? {
              name: el.parent_section?.title,
              path: el.parent_section?.path,
            }
          : null,
        createdAt: formatDate(el.created_at),
        updatedAt: formatDate(el.updated_at),
        path: el.path,
      };
    });
  }

  getSectionHeaders(): SectionHeaders {
    return {
      id: 'Ид',
      name: 'Наименование раздела',
      code: 'Код раздела',
      path: 'Ссылка раздела',
      parentSectionId: 'Идентификатор родительского раздела',
      parentSection: 'Родительский раздел',
      createdAt: 'Дата добавления',
      updatedAt: 'Дата обновления',
    };
  }

  /**
   * Сборка фильтров для секции
   * @param alias
   * @param filters
   * @private
   */
  private buildWhereParams(alias: string, filters?: AdminFilters) {
    const conditions: string[] = [];
    const whereParams: Record<string, string | number> = {};
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

    return { where: conditions.length ? conditions.join(' AND ') : '1=1', params: whereParams };
  }

  /**
   * Возвращает список секций с пагинацией, фильтром по имени и сортировкой.
   * @param query — параметры запроса (page, limit, nameFilter, sort, order)
   * @returns список секций
   */
  async execute(query: GetSectionsQuery): Promise<Sections> {
    try {
      const { page, limit, sort, order, filters } = query;

      const sortBy = this.validateSortColumn(sort);
      const sortDirection = this.getSortDirection(order);
      const sortColumn = this.SORT_MAP[sortBy] ?? 'p.id';
      const alias = 'p';
      const qb = this.repo.createQueryBuilder(alias);
      qb.leftJoinAndSelect('p.parent_section', 'parent');
      qb.select([
        'p.id',
        'p.title',
        'p.code',
        'p.path',
        'p.created_at',
        'p.updated_at',
        'parent.title',
        'parent.id',
        'parent.path',
      ]);

      const { where, params } = this.buildWhereParams(alias, filters);

      qb.where(where, params);
      qb.orderBy(sortColumn, sortDirection);
      qb.skip((page - 1) * limit).take(limit);

      const [items, total] = await qb.getManyAndCount();

      if (!items || !total) {
        return {
          total: 0,
          items: null,
          headers: null,
        };
      }

      const formatItems: CatalogSection[] = this.formatSections(items);

      return {
        total,
        items: formatItems.length > 0 ? formatItems : null,
        headers: this.getSectionHeaders(),
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to get sections',
        details: getDetailsErrorUtil(error),
      });
    }
  }
}
