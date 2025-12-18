export function assignIfDefined<T, K extends readonly (keyof T)[]>(
  target: T,
  source: Partial<T>,
  keys: K,
) {
  keys.forEach((key) => {
    const value = source[key];
    if (value !== undefined) {
      target[key] = value;
    }
  });
}
