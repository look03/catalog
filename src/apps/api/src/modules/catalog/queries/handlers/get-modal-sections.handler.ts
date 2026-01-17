import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';
import { GetModalSectionQuery } from '../impl/get-modal-sections.query';
import { Section } from '../../entities/section.entity';

@QueryHandler(GetModalSectionQuery)
export class GetModalSectionsHandler implements IQueryHandler<GetModalSectionQuery> {
  constructor(
    @InjectRepository(Section)
    private readonly repo: Repository<Section>,
  ) {}

  private readonly logger = new Logger('GetModalSectionsHandler');

  async execute(): Promise<null> {
    try {
      const sections = await this.repo.find({
        select: {
          title: true,
          id: true,
          parent_section: true,
        },
      });

      if (!sections) {
        return null;
      }
      console.log(sections, '<<<<<<<<<<<<<< sections');
      return null;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to get brands',
        details: getDetailsErrorUtil(error),
      });
    }
  }
}
