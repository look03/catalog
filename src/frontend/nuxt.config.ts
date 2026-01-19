export default defineNuxtConfig({
  compatibilityDate: '2026-01-17',
  devtools: { enabled: false },
  srcDir: 'client',
  css: ['~/assets/styles/main.scss'],
  ssr: false,
  typescript: {
    typeCheck: true,
  },
  imports: {
    autoImport: true,
    dirs: [
      // 'client/composables',
      // 'client/modules/**/composables',
    ],
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
      extensions: ['vue'],
    },
  ],
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '~/modules/auth',
  ],
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use '@/assets/styles/variables/index.scss' as *;
        `,
          quietDeps: true,
        },
      },
    },
  },
})
