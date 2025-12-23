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
