import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { EventBus } from '@nestjs/cqrs';
import { IndexDocumentCommand } from '../impl/index-document.command';

@CommandHandler(IndexDocumentCommand)
export class IndexDocumentHandler implements ICommandHandler<IndexDocumentCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: IndexDocumentCommand) {
    console.log(command, '<<<<<<<<<<<<<< command');
  }
}
