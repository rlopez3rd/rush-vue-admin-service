import { createRouter, createWebHistory } from 'vue-router'

import MainView from '@/views/MainView.vue'
import PermissionMiddleware from '@/middlewares/PermissionMiddleware'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView,
      beforeEnter: PermissionMiddleware,
      redirect: 'user-maintenance',
      children: [
        {
          path: '/user-maintenance',
          name: 'user-maintenance',
          component: () => import('@/pages/authenticated/user-maintenance.vue'),
        },
        {
          path: '/employee-dashboard',
          name: 'employee-dashboard',
          component: () => import('@/pages/authenticated/employee-dashboard.vue'),
        },
        // {
        //   path: '/role-maintenance',
        //   name: 'role-maintenance',
        //   component: () => import('@/pages/authenticated/role-maintenance.vue'),
        // },
      ],
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/pages/public/sign-in.vue'),
    },

    { path: '/landing', name: 'landing', component: () => import('@/pages/public/landing.vue') },
  ],
})

router.beforeEach(async (to, from, next) => {
  let user = localStorage.getItem('user')
  let token = localStorage.getItem('authorization')

  let roles = user ? JSON.parse(user).roles : []

  token = token ? JSON.parse(token).access_token : null

  if (roles?.includes('Admin')) {
    if (to.name === 'sign-in' && token) {
      router.push({ name: 'user-maintenance' })
    } else if (to.name !== 'sign-in' && !token) {
      router.push({ name: 'sign-in' })
    }
  } else {
    if (to.name === 'sign-in' && token) {
      router.push({ name: 'employee-dashboard' })
    } else if (to.name !== 'sign-in' && !token) {
      router.push({ name: 'sign-in' })
    }
  }

  next()
})

export default router
