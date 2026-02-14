import type { TransformFnParams } from 'class-transformer';

export function TransformStringToNumberArray() {
  return (params: TransformFnParams): number[] => {
    const value = params.value as unknown;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value) as unknown;
        if (
          Array.isArray(parsed) &&
          parsed.every((el) => typeof el === 'number' || typeof el === 'string')
        ) {
          return parsed.map((v) => Number(v));
        }
      } catch {
        return value
          .split(',')
          .map((v) => Number(v.trim()))
          .filter((v) => !isNaN(v));
      }
    }

    if (
      Array.isArray(value) &&
      value.every((el) => typeof el === 'number' || typeof el === 'string')
    ) {
      return value.map((v) => Number(v));
    }

    return [];
  };
}
