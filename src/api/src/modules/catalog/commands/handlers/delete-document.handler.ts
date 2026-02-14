import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDocumentCommand } from '../impl/delete-document.command';
import { ElasticService } from '../../services/elastic.service';

@CommandHandler(DeleteDocumentCommand)
export class DeleteDocumentHandler implements ICommandHandler<DeleteDocumentCommand> {
  constructor(private readonly elasticService: ElasticService) {}

  /**
   * Удаляет документ из Elasticsearch по id.
   * @param command — команда с id документа
   */
  async execute(command: DeleteDocumentCommand) {
    await this.elasticService.deleteDocument(command.id);
  }
}
