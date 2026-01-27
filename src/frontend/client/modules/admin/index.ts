import { defineNuxtModule, createResolver, addComponentsDir, addImportsDir } from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'admin-module',
    configKey: 'adminModule'
  },

  setup(_, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const globalPath = resolve('./global');
    addImportsDir(globalPath);
    // components
    addComponentsDir({
      path: resolve('./widgets'),
      global: true,
      pathPrefix: false
    });

    (nuxt.hook as any)('i18n:registerModule', (register: any) => {
      register({
        langDir: resolve('./lang'),
        locales: [
          {
            code: 'ru',
            file: 'ru.ts'
          }
        ]
      });
    });
    console.log('Finished registering adminModule');
  }
});
