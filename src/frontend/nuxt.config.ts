export default defineNuxtConfig({
  compatibilityDate: '2026-01-17',
  devtools: { enabled: true },
  srcDir: 'app',
  imports: {
    dirs: [
      'client/composables',
      'client/modules/**/composables',
    ],
  },
})
