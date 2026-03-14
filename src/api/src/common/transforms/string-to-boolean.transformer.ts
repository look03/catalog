import type { TransformFnParams } from 'class-transformer';

/**
 * Преобразует строку "true"/"false" из FormData в boolean. Для JSON оставляет boolean без изменений.
 */
export function TransformStringToBoolean() {
  return (params: TransformFnParams): boolean | undefined => {
    const value = params.value;
    if (typeof value === 'boolean') return value;
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0' || value === '') return false;
    if (value == null) return undefined;
    return undefined;
  };
}
