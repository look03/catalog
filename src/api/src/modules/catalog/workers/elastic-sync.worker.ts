import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ElasticService } from '../services/elastic.service';
import { SyncMetaService } from '../../common/services/sync-meta.service';
import { QueryBus } from '@nestjs/cqrs';
import { GetCatalogUpdatesQuery } from '../../admin/queries/impl/get-catalog-updates.query';
import { SearchSectionsAndProducts } from '../../../types/global.catalog';

@Injectable()
export class ElasticSyncWorker {
  private readonly logger = new Logger(ElasticSyncWorker.name);
  private readonly entityName = 'update_elastic';

  private isRunning = false;
  private readonly maxRetries = 3;

  constructor(
    private readonly queryBus: QueryBus,
    private readonly elasticService: ElasticService,
    private readonly syncMetaRepository: SyncMetaService,
  ) {}

  /**
   * Раз в минуту синхронизирует каталог с Elasticsearch (изменения после lastSync).
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleSync() {
    if (this.isRunning) {
      this.logger.warn('Skipped run: previous process is still running');
      return;
    }

    this.isRunning = true;

    try {
      await this.syncWithRetry();
    } catch (error) {
      this.logger.error('Failed to synchronize after retry attempts', error);
    } finally {
      this.isRunning = false;
      this.logger.log('Worker updateElastic finished');
    }
  }

  /**
   * Загружает изменения после lastSync, отправляет bulk в Elastic, обновляет lastSync; при ошибке повторяет до maxRetries.
   * @param attempt — номер попытки (по умолчанию 1)
   */
  private async syncWithRetry(attempt = 1): Promise<void> {
    const lastSync = (await this.syncMetaRepository.getLastSync(this.entityName)) || new Date(0);

    const items: SearchSectionsAndProducts = await this.queryBus.execute(
      new GetCatalogUpdatesQuery(lastSync),
    );

    const docs = [...items.sections, ...items.products].map((doc) => ({ ...doc }));
    if (!docs.length) {
      this.logger.log('No new items for synchronization');
      return;
    }

    try {
      this.logger.log(`Attempt ${attempt}: Synchronizing ${docs.length} items`);

      await this.elasticService.syncDocumentsBulk(docs);

      const maxUpdatedAt = docs.reduce(
        (max, item) => (item.updated_at > max ? item.updated_at : max),
        lastSync,
      );

      await this.syncMetaRepository.updateLastSync(this.entityName, maxUpdatedAt);

      this.logger.log('Synchronization completed successfully');
    } catch (error) {
      this.logger.error(`Synchronization error on attempt ${attempt}`, error);

      if (attempt < this.maxRetries) {
        this.logger.log(`Retrying synchronization (#${attempt + 1}) in 5 seconds`);
        await this.delay(5000);
        return this.syncWithRetry(attempt + 1);
      } else {
        throw error;
      }
    }
  }

  /**
   * Задержка в миллисекундах (для повтора при ошибке).
   * @param ms — миллисекунды
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
