import { BadRequestException } from '@nestjs/common';
import { TransformFnParams } from 'class-transformer';
export function ParseJsonTransformer() {
  return (params: TransformFnParams): Record<string, unknown> | undefined => {
    const value = params.value;

    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as Record<string, unknown>;
      } catch {
        throw new BadRequestException('filter must be a valid JSON string');
      }
    }
  };
}
