import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { EventBus } from '@nestjs/cqrs';
import { ReIndexCommand } from '../impl/re-index.command';
import { ElasticService } from '../../services/elastic.service';
import { InternalServerErrorException } from '@nestjs/common';
import * as process from 'node:process';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';

@CommandHandler(ReIndexCommand)
export class ReIndexHandler implements ICommandHandler<ReIndexCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus,
    private readonly elasticService: ElasticService,
  ) {}

  /**
   * Возвращает mapping для индекса каталога (type, name, code, price, paths и т.д.).
   * @returns объект маппинга
   */
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

  /**
   * Создаёт новый индекс, загружает в него секции и продукты, переключает алиас.
   * @param command — команда с массивами sections и products
   */
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
        message: 'Failed to create index elastic',
        details: getDetailsErrorUtil(error),
      });
    }
  }
}
