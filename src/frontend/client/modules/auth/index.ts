import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
} from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'auth-module',
    configKey: 'authModule',
  },

  setup(_, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // components
    addComponentsDir({
      path: resolve('./widgets'),
      global: true,
      pathPrefix: false,
    });

    nuxt.hook('i18n:registerModule', register => {
      register({
        langDir: resolve('./lang'),
        locales: [
          {
            code: 'ru',
            file: 'ru.ts',
          },
        ]
      })
    })
    console.log('Finished registering authModule');
  },
});
