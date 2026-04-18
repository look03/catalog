import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetRootSectionsQuery } from '../impl/get-root-sections.query';
import { Section } from '../../../admin/entities/section.entity';

export type CatalogRootSectionNav = {
  id: number;
  title: string;
  path: string;
};

function sectionPath(row: Section): string {
  const p = row.path?.trim();
  if (p) {
    return p;
  }
  return `/catalog/${row.code}/`;
}

@QueryHandler(GetRootSectionsQuery)
export class GetRootSectionsHandler implements IQueryHandler<GetRootSectionsQuery> {
  private readonly logger = new Logger(GetRootSectionsHandler.name);

  constructor(
    @InjectRepository(Section)
    private readonly sectionRepo: Repository<Section>,
  ) {}

  async execute(): Promise<CatalogRootSectionNav[]> {
    try {
      const rows = await this.sectionRepo
        .createQueryBuilder('s')
        .where('s.active = :active', { active: true })
        .andWhere('s.parent_section_id IS NULL')
        .orderBy('s.title', 'ASC')
        .getMany();

      return rows.map((s) => ({
        id: s.id,
        title: s.title,
        path: sectionPath(s),
      }));
    } catch (error) {
      this.logger.warn(
        `Catalog root sections (DB): ${error instanceof Error ? error.message : String(error)}`,
      );
      return [];
    }
  }
}
