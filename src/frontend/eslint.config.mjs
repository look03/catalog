import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

const __dirname = dirname(fileURLToPath(import.meta.url));
const nuxtEslintPath = join(__dirname, '.nuxt', 'eslint.config.mjs');

async function loadConfig() {
  if (existsSync(nuxtEslintPath)) {
    const withNuxt = (await import(pathToFileURL(nuxtEslintPath).href)).default;
    return withNuxt([eslintPluginPrettierRecommended]);
  }
  // Fallback без .nuxt: полный конфиг для app/ (Vue, TypeScript)
  return createConfigForNuxt({ dirs: { root: ['.', 'app'] } }, eslintPluginPrettierRecommended);
}

export default loadConfig();
