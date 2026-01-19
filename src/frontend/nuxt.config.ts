export default defineNuxtConfig({
  compatibilityDate: '2026-01-17',
  devtools: { enabled: true },
  srcDir: 'app',
  css: ['~/assets/styles/main.scss'],
  imports: {
    dirs: [
      'client/composables',
      'client/modules/**/composables',
    ],
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
      extensions: ['vue'],
    },
  ],
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @import '@/assets/styles/variables/index.scss';
        `,
          quietDeps: true,
        },
      },
    },
  },
})
