import type { RouterConfig } from '@nuxt/schema';

export default <RouterConfig>{
  routes: (_routes) => [
    {
      path: '/',
      redirect: '/catalog/'
    },
    {
      path: '/auth/',
      component: () => import('~/pages/AuthPage.vue'),
      meta: {
        layout: 'auth'
      }
    },
    {
      path: '/catalog/:catalogPath(.*)*',
      component: () => import('~/pages/CatalogPage.vue'),
      meta: {
        layout: 'catalog'
      }
    },
    {
      path: '/admin/',
      component: () => import('~/pages/AdminPage.vue'),
      meta: {
        layout: 'admin'
      }
    }
  ]
};
