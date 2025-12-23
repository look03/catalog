import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { EventBus, CommandBus } from '@nestjs/cqrs';
import { InternalServerErrorException } from '@nestjs/common';
import { ReIndexSearchCommand } from '../impl/reindex-search.command';
import { ReIndexSearchService } from '../../services/reindex-search.service';
import { ReIndexCommand } from '../../../search/commands/impl/re-index.command';

@CommandHandler(ReIndexSearchCommand)
export class ReIndexSearchHandler implements ICommandHandler<ReIndexSearchCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly reIndexSearchService: ReIndexSearchService,
  ) {}

  async execute() {
    try {
      const response = await this.reIndexSearchService.getReIndexData();

      if (!response) {
        return {
          message: 'There are no products in the catalog.',
        };
      }

      await this.commandBus.execute(new ReIndexCommand(response.products, response.sections));
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: error.message ?? 'Failed to update product',
        details: error.details ?? error.message ?? error,
      });
    }
  }
}
