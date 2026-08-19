import { createRouter, createWebHistory } from 'vue-router'

import { routes } from './routes'

import { useAuthStore } from '@/modules/samples/states/auth';

const router = createRouter({

  history: createWebHistory(import.meta.env.BASE_URL),

  routes,

})

router.beforeEach((to) => {

  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {

    return {

      name: 'auth',

      query: { redirect: to.fullPath }

    }

  }

  if (to.name === 'auth' && authStore.isAuthenticated) {

    return { name: 'home' }

  }

})

export default router