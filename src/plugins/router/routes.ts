export const routes = [
  { path: '/', redirect: '/test/n1' },
  // {
  //   path: '/',
  //   component: () => import('@/layouts/default.vue'),
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/pages/dashboard.vue'),
  //     },
  //     {
  //       path: 'account-settings',
  //       component: () => import('@/pages/account-settings.vue'),
  //     },
  //     {
  //       path: 'typography',
  //       component: () => import('@/pages/typography.vue'),
  //     },
  //     {
  //       path: 'icons',
  //       component: () => import('@/pages/icons.vue'),
  //     },
  //     {
  //       path: 'cards',
  //       component: () => import('@/pages/cards.vue'),
  //     },
  //     {
  //       path: 'tables',
  //       component: () => import('@/pages/tables.vue'),
  //     },
  //     {
  //       path: 'form-layouts',
  //       component: () => import('@/pages/form-layouts.vue'),
  //     },
  //   ],
  // },
  {
    path: '/test/',
    redirect: '/test/n1',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'n:level',
        component: () => import('@/pages/test/test-list.vue'),
      },
      {
        path: ':id',
        component: () => import('@/pages/test/test-detail.vue')
      }
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      // {
      //   path: 'login',
      //   component: () => import('@/pages/login.vue'),
      // },
      // {
      //   path: 'register',
      //   component: () => import('@/pages/register.vue'),
      // },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
