import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSectionsQuery } from '../impl/get-sections.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from '../../entities/section.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { formatDate } from '../../../../common/utils/date-format.util';
import { BasePaginationFilterHandler } from './base-pagination-filter.handler';
import { CatalogSection, Sections } from '../../interfaces/section.interfaces';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';

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
        parent_section_id: el.parent_section?.id || null,
        parent_section: el.parent_section
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

      const qb = this.repo.createQueryBuilder('p');
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

      if (filters?.name) {
        qb.where('p.title ILIKE :title', { title: `%${filters.name}%` });
      }

      qb.orderBy(sortColumn, sortDirection);
      qb.skip((page - 1) * limit).take(limit);

      const [items, total] = await qb.getManyAndCount();

      if (!items || !total) {
        return {
          total: 0,
          items: null,
        };
      }

      const formatItems: CatalogSection[] = this.formatSections(items);

      return {
        total,
        items: formatItems.length > 0 ? formatItems : null,
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
