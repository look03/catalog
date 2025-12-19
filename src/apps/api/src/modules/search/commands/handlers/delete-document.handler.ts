import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { EventBus } from '@nestjs/cqrs';
import { DeleteDocumentCommand } from '../impl/delete-document.command';

@CommandHandler(DeleteDocumentCommand)
export class DeleteDocumentHandler implements ICommandHandler<DeleteDocumentCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteDocumentCommand) {}
}
