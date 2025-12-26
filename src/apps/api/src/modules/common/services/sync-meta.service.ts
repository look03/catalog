import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SyncMeta } from '../entities/sync-meta.entity';
import { getDetailsErrorUtil } from '../../../common/utils/error.utils';
@Injectable()
export class SyncMetaService {
  constructor(
    @InjectRepository(SyncMeta)
    private readonly repo: Repository<SyncMeta>,
  ) {}

  async getLastSync(entityName: string): Promise<Date | null> {
    const record = await this.repo.findOneBy({ entityName });
    return record?.lastSyncAt ?? null;
  }

  async updateLastSync(entityName: string, date: Date): Promise<void> {
    try {
      await this.repo.save({ entityName, lastSyncAt: date });
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to update sync meta',
        details: getDetailsErrorUtil(error),
      });
    }
  }
}
