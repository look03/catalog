export const isNotEmptyObject = (obj: unknown): obj is Record<string, unknown> =>
  typeof obj === 'object' && obj !== null && Object.keys(obj).length > 0;
