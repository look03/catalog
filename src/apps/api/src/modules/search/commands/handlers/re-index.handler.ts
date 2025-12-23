import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { EventBus } from '@nestjs/cqrs';
import { ReIndexCommand } from '../impl/re-index.command';
import { ElasticService } from '../../services/elastic.service';
import { InternalServerErrorException } from '@nestjs/common';
import * as process from 'node:process';

@CommandHandler(ReIndexCommand)
export class ReIndexHandler implements ICommandHandler<ReIndexCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus,
    private readonly elasticService: ElasticService,
  ) {}

  private getMapping(): object {
    return {
      mappings: {
        properties: {
          type: {
            type: 'keyword',
          },
          name: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
                ignore_above: 256,
              },
            },
          },
          code: {
            type: 'keyword',
          },
          price: {
            type: 'double',
          },
          brand_code: {
            type: 'keyword',
          },
          parent_section_id: {
            type: 'keyword',
          },
          paths: {
            type: 'keyword',
          },
        },
      },
    };
  }

  async execute(command: ReIndexCommand) {
    try {
      const alias: string | undefined = process.env.ELASTIC_ALIAS || undefined;
      const newIndex = `${alias}_${Date.now()}`;
      await this.elasticService.createIndex(newIndex, this.getMapping());
      const docs = [...command.sections, ...command.products].map((doc) => ({ ...doc }));
      await this.elasticService.bulk(newIndex, docs);
      await this.elasticService.switchAlias(alias, newIndex);
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: error.message ?? 'Failed to create index elastic',
        details: error.details || error.response?.details || error.message || error,
      });
    }
  }
}
