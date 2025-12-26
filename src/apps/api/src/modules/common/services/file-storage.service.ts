// catalog/services/file-storage.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { UpdateFiles } from '../../../types/global.catalog';
import { getDetailsErrorUtil } from '../../../common/utils/error.utils';

@Injectable()
export class FileStorageService {
  private tempDir = './tmp/uploads';
  private uploadRoot = './uploads';

  getTmpDir() {
    return this.tempDir;
  }

  getUploadRoot() {
    return this.uploadRoot;
  }

  async clearDirectory(dirPath: string): Promise<void> {
    const files = await fs.readdir(dirPath);

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);

        if (stat.isFile()) {
          await fs.unlink(filePath);
        } else if (stat.isDirectory()) {
          await fs.rm(filePath, { recursive: true, force: true });
        }
      }),
    );

    await this.clearDirWithFiles(path.dirname(dirPath));
  }

  async clearDirWithFiles(dirPath: string): Promise<void> {
    const stat = await fs.stat(dirPath);
    if (stat.isDirectory()) {
      await fs.rm(dirPath, { recursive: true, force: true });
    }
  }

  async moveFromTemp(
    files: UpdateFiles[] | null | undefined,
    oldFileDir?: string | null,
  ): Promise<void> {
    if (!files || !files.length) {
      return;
    }

    try {
      if (oldFileDir) {
        await this.clearDirectory(oldFileDir);
      }

      const targetDir = path.dirname(files[0].destPath);
      const tmpDir = path.dirname(files[0].tmpPath);
      await fs.mkdir(targetDir, { recursive: true });
      for (const file of files) {
        await fs.rename(file.tmpPath, file.destPath);
      }

      await this.clearDirWithFiles(tmpDir);
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to moveFromTemp files',
        details: getDetailsErrorUtil(error),
      });
    }
  }

  async cleanupTemp(files: UpdateFiles[] | null | undefined): Promise<void> {
    if (!files || !files.length) {
      return;
    }
    try {
      const tmpDir = path.dirname(files[0].tmpPath);
      for (const file of files) {
        await fs.unlink(file.tmpPath);
      }
      await this.clearDirWithFiles(tmpDir);
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to delete files',
        details: getDetailsErrorUtil(error),
      });
    }
  }
}
