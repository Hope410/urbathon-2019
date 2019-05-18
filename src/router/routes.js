
const routes = [
  {
    path: '/',
    component: () => import('pages/Index.vue')
  },
  {
    path: '/sighted',
    component: () => import('layouts/Main.vue'),
    children: [
      {
        path: '/',
        component: () => import('pages/sighted.vue')
      }
    ]
  },
  {
    path: '/unsighted',
    component: () => import('pages/unsighted.vue'),
    // children: [
    //   {
    //     path: '/',
    //     component: () => import('pages/unsighted.vue')
    //   }
    // ]
  },
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
