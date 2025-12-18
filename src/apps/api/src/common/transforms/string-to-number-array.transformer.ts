import { TransformFnParams } from 'class-transformer';

export function TransformStringToNumberArray() {
  return (params: TransformFnParams): number[] | any => {
    const value = params.value;

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);

        if (
          Array.isArray(parsed) &&
          parsed.every((el) => typeof el === 'number' || typeof el === 'string')
        ) {
          return parsed.map((v) => Number(v));
        }
      } catch {
        // Если не JSON, пробуем разделить по запятой
        return value
          .split(',')
          .map((v) => Number(v.trim()))
          .filter((v) => !isNaN(v)); // отфильтровать нечисла
      }
    }

    // Если это уже массив, проверить и преобразовать
    if (
      Array.isArray(value) &&
      value.every((el) => typeof el === 'number' || typeof el === 'string')
    ) {
      return value.map((v) => Number(v));
    }

    // Если не получилось привести к массиву чисел — возвращаем пустой массив или null
    return [];
  };
}
