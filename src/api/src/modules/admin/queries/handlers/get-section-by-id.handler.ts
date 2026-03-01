import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';
import { Section } from '../../entities/section.entity';
import { GetSectionByIdQuery } from '../impl/get-section-by-id.query';
import { EditSection } from '../../interfaces/section.interfaces';

@QueryHandler(GetSectionByIdQuery)
export class GetSectionByIdHandler implements IQueryHandler<GetSectionByIdQuery> {
  constructor(
    @InjectRepository(Section)
    private readonly repo: Repository<Section>,
  ) {}

  private readonly logger = new Logger('GetSectionByIdHandler');

  /**
   * Возвращает данные секции для обновления.
   */
  async execute(query: GetSectionByIdQuery): Promise<EditSection | null> {
    try {
      const sectionInfo = await this.repo
        .createQueryBuilder('s')
        .leftJoinAndSelect('s.parent_section', 'ps')
        .select(['s.title', 'ps.id'])
        .where('s.id = :id', { id: query.id })
        .getOne();

      if (!sectionInfo) {
        return null;
      }

      return {
        sectionName: sectionInfo.title,
        parentSectionId: sectionInfo.parent_section?.id ?? null,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to get section by id',
        details: getDetailsErrorUtil(error),
      });
    }
  }
}
