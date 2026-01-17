import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addImportsDir,
} from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'auth-module',
    configKey: 'auth-module',
    compatibility: {
      nuxt: '^4.2.2',
    },
  },
  async setup() {
    const { resolve } = createResolver(import.meta.url);
    const widgetsPath = resolve('./widgets');
    // const globalPath = resolve('./global');
    // addImportsDir(globalPath);
    await addComponentsDir({
      path: widgetsPath,
      global: true,
      pathPrefix: false,
    });

    console.log('Successfully added module Auth');
  },
});
