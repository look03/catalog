import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSectionCommand } from '../../impl/section/delete-section.command';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from '../../../entities/section.entity';
import { Repository } from 'typeorm';
import { DeleteDocumentCommand } from '../../../../search/commands/impl/delete-document.command';

@CommandHandler(DeleteSectionCommand)
export class DeleteSectionHandler implements ICommandHandler<DeleteSectionCommand> {
  constructor(
    @InjectRepository(Section)
    private readonly repo: Repository<Section>,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: DeleteSectionCommand) {
    try {
      const section = await this.repo.findOneBy({ id: command.id });
      if (!section) {
        throw new NotFoundException(`Section with id ${command.id} not found`);
      }

      await this.repo.remove(section);
      await this.commandBus.execute(new DeleteDocumentCommand(command.id.toString()));
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to delete section',
        details: error.message ?? error,
      });
    }
  }
}
