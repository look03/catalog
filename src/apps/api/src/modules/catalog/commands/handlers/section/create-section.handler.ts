import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSectionCommand } from '../../impl/section/create-section.command';
import { InternalServerErrorException } from '@nestjs/common';
import { transliterate } from '../../../../../common/utils/transliteration.util';
import { SectionService } from '../../../services/section.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from '../../../entities/section.entity';
import { Repository } from 'typeorm';
import { EventBus } from '@nestjs/cqrs';
import { SectionChangesEvent } from '../../../events/section-changes.event';
import { SearchSection } from '../../../../../types/global.catalog';

@CommandHandler(CreateSectionCommand)
export class CreateSectionHandler implements ICommandHandler<CreateSectionCommand> {
  constructor(
    @InjectRepository(Section)
    private readonly repo: Repository<Section>,
    private readonly sectionService: SectionService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateSectionCommand) {
    try {
      const code = transliterate(command.title) ?? undefined;
      const fields = {
        title: command.title,
        code,
      };

      const section = this.repo.create(fields);
      await this.sectionService.designParentSection(command.parent_section_id, code, section);
      const result = await this.repo.save(section);

      const searchSection: SearchSection = {
        id: result.id,
        title: result.title,
        code: result.code,
        path: result.code,
        parent_section_id: result.id,
        type: 'section',
      };

      this.eventBus.publish(new SectionChangesEvent(searchSection));

      return {
        section_id: result.id,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create section',
        details: error.message ?? error,
      });
    }
  }
}
