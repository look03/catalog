import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';
import { GetSectionsForSelectQuery } from '../impl/get-sections-for-select.query';
import { Section } from '../../entities/section.entity';
import type { SectionOption } from '../../interfaces/section.interfaces';

// const INDENT_PER_LEVEL = 3;
// const CHILD_PREFIX = '└ ';

@QueryHandler(GetSectionsForSelectQuery)
export class GetSectionsForSelectHandler implements IQueryHandler<GetSectionsForSelectQuery> {
  constructor(
    @InjectRepository(Section)
    private readonly repo: Repository<Section>,
  ) {}

  private readonly logger = new Logger('GetSectionsForSelectHandler');

  /**
   * Рекурсивно собирает секции в иерархический плоский список (поддержка любой вложенности).
   */
  private collectHierarchical(
    sections: Section[],
    parentId: number | null,
    depth: number,
  ): SectionOption[] {
    const result: SectionOption[] = [];
    const children = sections.filter((s) => (s.parent_section?.id ?? null) === parentId);
    children.sort((a, b) => a.title.localeCompare(b.title));

    for (const s of children) {
      // const indent = ' '.repeat(depth * INDENT_PER_LEVEL);
      // const prefix = depth > 0 ? CHILD_PREFIX : '';
      result.push({
        id: s.id,
        name: s.title,
        parentSectionId: s.parent_section?.id ?? null,
      });
      result.push(...this.collectHierarchical(sections, s.id, depth + 1));
    }

    return result;
  }

  async execute(): Promise<SectionOption[]> {
    try {
      const sections = await this.repo.find({
        select: { id: true, title: true },
        relations: ['parent_section'],
      });

      if (!sections?.length) {
        return [];
      }

      return this.collectHierarchical(sections, null, 0);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to get sections for select',
        details: getDetailsErrorUtil(error),
      });
    }
  }
}
