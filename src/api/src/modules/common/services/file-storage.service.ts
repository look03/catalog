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

  /**
   * Возвращает путь к директории временных загрузок.
   * @returns путь к temp-директории
   */
  getTmpDir() {
    return this.tempDir;
  }

  /**
   * Возвращает корневой путь для загруженных файлов.
   * @returns корневой путь uploads
   */
  getUploadRoot() {
    return this.uploadRoot;
  }

  /**
   * Рекурсивно удаляет содержимое директории и саму директорию (если пуста).
   * @param dirPath — путь к директории
   */
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

  /**
   * Удаляет директорию со всем содержимым (рекурсивно).
   * @param dirPath — путь к директории
   */
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

  /**
   * Удаляет пустые директории рекурсивно вверх, пока не достигнет uploads/images.
   * @param dirPath — путь к директории
   */
  private async removeEmptyDirsUpToImages(dirPath: string): Promise<void> {
    const imagesRoot = path.resolve(this.uploadRoot, 'images');
    let currentDir = path.resolve(dirPath);

    while (currentDir !== imagesRoot && currentDir.startsWith(imagesRoot)) {
      try {
        const entries = await fs.readdir(currentDir);
        if (entries.length > 0) {
          break;
        }
        await fs.rmdir(currentDir);
        currentDir = path.dirname(currentDir);
      } catch {
        break;
      }
    }
  }

  /**
   * Удаляет файлы по путям (абсолютным или относительно cwd).
   * Если директория осталась пустой, удаляет её из uploads/images.
   * @param filePaths — массив путей к файлам для удаления
   */
  async deleteFiles(filePaths: string[]): Promise<void> {
    if (!filePaths?.length) {
      return;
    }
    try {
      const affectedDirs = new Set<string>();
      for (const filePath of filePaths) {
        const fullPath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
        affectedDirs.add(path.dirname(fullPath));
        await fs.unlink(fullPath).catch(() => {});
      }
      for (const dir of affectedDirs) {
        await this.removeEmptyDirsUpToImages(dir);
      }
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to delete files',
        details: getDetailsErrorUtil(error),
      });
    }
  }

  /**
   * Удаляет временные файлы и пустую temp-директорию (при ошибке после загрузки).
   * @param files — массив путей к временным файлам
   */
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
