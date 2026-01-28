import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSectionCommand } from '../impl/update-section.command';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { transliterate } from '../../../../common/utils/transliteration.util';
import { SectionService } from '../../services/section.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from '../../entities/section.entity';
import { Repository } from 'typeorm';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';

@CommandHandler(UpdateSectionCommand)
export class UpdateSectionHandler implements ICommandHandler<UpdateSectionCommand> {
  constructor(
    @InjectRepository(Section)
    private readonly repo: Repository<Section>,
    private readonly sectionService: SectionService,
  ) {}

  async execute(command: UpdateSectionCommand) {
    try {
      const section = await this.repo.findOneBy({ id: command.id });
      if (!section) {
        throw new NotFoundException(`Section with id ${command.id} not found`);
      }

      if (section.id === command.parent_section_id) {
        throw new InternalServerErrorException(
          'The section ID and parent_section_id must not be equal.',
        );
      }

      let code: string = '';
      if (command.title) {
        code = transliterate(command.title) as string;
        section.title = command.title;
        section.code = code;
      }

      if (command.active !== undefined) {
        section.active = command.active;
      }

      await this.sectionService.designParentSection(command.parent_section_id, code, section);

      await this.repo.save(section);
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to update section',
        details: getDetailsErrorUtil(error),
      });
    }
  }
}
