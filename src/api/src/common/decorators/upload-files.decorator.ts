import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';

export function UploadFiles(fieldName = 'images', maxCount = 5, baseUploadPath = './tmp/uploads') {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(fieldName, maxCount, {
        storage: diskStorage({
          destination: (req, file, callback) => {
            if (!req['uploadTempDir']) {
              req['uploadTempDir'] = randomUUID();
            }

            const uploadPath = `${baseUploadPath}/${req['uploadTempDir']}`;

            // Создаём папку если не существует
            if (!existsSync(uploadPath)) {
              mkdirSync(uploadPath, { recursive: true });
            }

            callback(null, uploadPath);
          },
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            callback(null, `${uniqueSuffix}${ext}`);
          },
        }),
      }),
    ),
  );
}
