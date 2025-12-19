// catalog/services/file-storage.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { UpdateFiles } from '../../../types/global.catalog';

@Injectable()
export class FileStorageService {
  private tempDir = path.resolve('./temp');
  private uploadRoot = path.resolve('./uploads');

  getTmpDir() {
    return this.tempDir;
  }

  getUploadRoot() {
    return this.uploadRoot;
  }

  async moveFromTemp(files: UpdateFiles[] | null): Promise<void> {
    if (!files || !files.length) {
      return;
    }

    try {
      const targetDir = path.dirname(files[0].destPath);

      await fs.mkdir(targetDir, { recursive: true });

      for (const file of files) {
        await fs.rename(file.tmpPath, file.destPath);
      }
    } catch (e) {
      throw new InternalServerErrorException({
        success: false,
        message: e.message ?? 'Failed to moveFromTemp files',
        details: e.details ?? e.message ?? e,
      });
    }
  }

  async cleanupTemp(files: UpdateFiles[] | null): Promise<void> {
    if (!files || !files.length) {
      return;
    }

    for (const file of files) {
      try {
        await fs.unlink(file.tmpPath);
      } catch (e) {
        throw new InternalServerErrorException({
          success: false,
          message: e.message ?? 'Failed to delete files',
          details: e.details ?? e.message ?? e,
        });
      }
    }
  }
}
