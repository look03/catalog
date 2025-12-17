import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSectionCommand } from '../../impl/section/create-section.command';
import { InternalServerErrorException } from '@nestjs/common';
import { transliterate } from '../../../../common/utils/transliteration.util';
import { SectionService } from '../../../services/section.service';

@CommandHandler(CreateSectionCommand)
export class CreateSectionHandler implements ICommandHandler<CreateSectionCommand> {
  constructor(private readonly sectionService: SectionService) {}

  async execute(command: CreateSectionCommand) {
    try {
      const fields = {
        title: command.title,
        code: transliterate(command.title) ?? undefined,
      };

      const section = this.sectionService.create(fields);

      section.parent_section = await this.sectionService.checkParentSection(
        command.parent_section_id,
      );

      const result = await this.sectionService.save(section);

      return result.id;
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create section',
        details: error.message ?? error,
      });
    }
  }
}
