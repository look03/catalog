/**
 * Возвращает учётные данные Elasticsearch из env (username, password) или undefined.
 * @returns объект { username, password } или undefined
 */
export function getElasticAuth() {
  const username = process.env.ELASTIC_USERNAME;
  const password = process.env.ELASTIC_PASSWORD;

  if (!username || !password) {
    return undefined;
  }

  return {
    username,
    password,
  };
}
