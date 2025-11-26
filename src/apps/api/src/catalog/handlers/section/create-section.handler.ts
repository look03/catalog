import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSectionCommand } from '../../commands/create-section.command';
import { Section } from '../../entities/section.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { transliterate } from '../../../common/utils/transliteration.util';

@CommandHandler(CreateSectionCommand)
export class CreateSectionHandler implements ICommandHandler<CreateSectionCommand> {
  constructor(
    @InjectRepository(Section)
    private readonly repo: Repository<Section>,
  ) {}

  async execute(command: CreateSectionCommand) {
    try {
      const fields = {
        title: command.title,
        parent_section_id: command.parent_section_id ?? undefined,
        code: transliterate(command.title) ?? undefined,
        image: undefined,
      };

      const product = this.repo.create(fields);
      const result = await this.repo.save(product);

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
