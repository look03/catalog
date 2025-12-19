import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { EventBus } from '@nestjs/cqrs';
import { InternalServerErrorException } from '@nestjs/common';
import { ReIndexSearchCommand } from '../impl/reindex-search.command';
import { ReIndexSearchService } from '../../services/reindex-search.service';

@CommandHandler(ReIndexSearchCommand)
export class ReIndexSearchHandler implements ICommandHandler<ReIndexSearchCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus,
    private readonly reIndexSearchService: ReIndexSearchService,
  ) {}

  async execute() {
    try {
      await this.reIndexSearchService.getReIndexData();
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: error.message ?? 'Failed to update product',
        details: error.details ?? error.message ?? error,
      });
    }
  }
}
