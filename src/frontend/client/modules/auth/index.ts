import { defineNuxtModule, createResolver, addComponentsDir } from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'auth-module',
    configKey: 'auth-module',
    compatibility: {
      nuxt: '^4.2.2',
    },
  },
  async setup() {
    console.log('auth-module setup started');

    const { resolve } = createResolver(import.meta.url);
    const widgetsPath = resolve('./widgets');

    addComponentsDir({
      path: widgetsPath,
      global: true,
      pathPrefix: false,
    });

    console.log('auth-module setup finished');
  },
});
