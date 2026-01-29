import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class HashPathService {
  /**
   * Строит путь из хеша числа: сегменты по segmentLength символов (depth штук) + полный хеш.
   * @param value — число для хеширования
   * @param depth — количество сегментов в пути
   * @param segmentLength — длина одного сегмента в символах
   * @returns путь (например, "ab/cd/abcd...")
   */
  getHashedPath(value: number, depth = 2, segmentLength = 2): string {
    const hash = crypto.createHash('sha256').update(String(value)).digest('hex');

    const segments: string[] = [];

    for (let i = 0; i < depth; i++) {
      segments.push(hash.slice(i * segmentLength, (i + 1) * segmentLength));
    }

    return path.join(...segments, hash);
  }
}
