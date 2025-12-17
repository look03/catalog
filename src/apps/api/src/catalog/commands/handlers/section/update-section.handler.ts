import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSectionCommand } from '../../impl/section/update-section.command';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { transliterate } from '../../../../common/utils/transliteration.util';
import { SectionService } from '../../../services/section.service';

@CommandHandler(UpdateSectionCommand)
export class UpdateSectionHandler implements ICommandHandler<UpdateSectionCommand> {
  constructor(private readonly sectionService: SectionService) {}

  async execute(command: UpdateSectionCommand) {
    try {
      const section = await this.sectionService.findOneById(command.id);
      if (!section) {
        throw new NotFoundException(`Section with id ${command.id} not found`);
      }

      if (command.title) {
        section.title = command.title;
        section.code = transliterate(command.title) as string;
      }

      section.parent_section = await this.sectionService.checkParentSection(
        command.parent_section_id,
      );

      await this.sectionService.save(section);

      return section.id;
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to update section',
        details: error.message ?? error,
      });
    }
  }
}
