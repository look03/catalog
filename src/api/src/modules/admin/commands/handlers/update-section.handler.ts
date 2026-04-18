import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSectionCommand } from '../impl/update-section.command';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { transliterate } from '../../../../common/utils/transliteration.util';
import { SectionService } from '../../services/section.service';
import { Section } from '../../entities/section.entity';
import { DataSource, EntityManager } from 'typeorm';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';

@CommandHandler(UpdateSectionCommand)
export class UpdateSectionHandler implements ICommandHandler<UpdateSectionCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly sectionService: SectionService,
  ) {}

  /**
   * Обновляет секцию (title, code, active, parent_section) и пересчитывает path.
   * @param command — команда с id и полями для обновления
   */
  async execute(command: UpdateSectionCommand) {
    try {
      return await this.dataSource.transaction(async (manager: EntityManager): Promise<void> => {
        const sectionRepo = manager.getRepository(Section);
        const section = await sectionRepo.findOneBy({ id: command.id });
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

        await sectionRepo.save(section);

        if (command.active !== undefined) {
          await this.sectionService.updateSectionActivityTree(manager, section.id, command.active);
        }
      });
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to update section',
        details: getDetailsErrorUtil(error),
      });
    }
  }
}
