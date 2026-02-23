const getTime = () => {
  return new Date().toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export function logError(moduleKey: string, actionKey: string, error?: unknown) {
  if (import.meta.server || import.meta.dev) {
    console.error(getTime(), `ERROR::${moduleKey}::${actionKey}`, error);
  }
}
