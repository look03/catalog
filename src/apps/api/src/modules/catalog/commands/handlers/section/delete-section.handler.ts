import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSectionCommand } from '../../impl/section/delete-section.command';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { SectionService } from '../../../services/section.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from '../../../entities/section.entity';
import { Repository } from 'typeorm';

@CommandHandler(DeleteSectionCommand)
export class DeleteSectionHandler implements ICommandHandler<DeleteSectionCommand> {
  constructor(
    @InjectRepository(Section)
    private readonly repo: Repository<Section>,
  ) {}

  async execute(command: DeleteSectionCommand) {
    try {
      const section = await this.repo.findOneBy({ id: command.id });
      if (!section) {
        throw new NotFoundException(`Section with id ${command.id} not found`);
      }

      await this.repo.remove(section);
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to delete section',
        details: error.message ?? error,
      });
    }
  }
}
