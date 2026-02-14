import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform<unknown, unknown> {
  transform(value: unknown): unknown {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as unknown;
      } catch {
        throw new BadRequestException('Invalid JSON string');
      }
    }

    return value;
  }
}
