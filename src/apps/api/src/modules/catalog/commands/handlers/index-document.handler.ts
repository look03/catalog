import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IndexDocumentCommand } from '../impl/index-document.command';
import { ElasticService } from '../../services/elastic.service';

@CommandHandler(IndexDocumentCommand)
export class IndexDocumentHandler implements ICommandHandler<IndexDocumentCommand> {
  constructor(private readonly elasticService: ElasticService) {}

  async execute(command: IndexDocumentCommand) {
    await this.elasticService.updateOrCreate(command.document.id.toString(), command.document);
  }
}
