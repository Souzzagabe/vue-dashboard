import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useAuthStore } from '@/modules/samples/states/auth'
import type { Role } from '@/shared/types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.init()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'auth',
      query: { redirect: to.fullPath },
    }
  }

  const roles = to.meta.roles as Role[] | undefined
  if (to.meta.requiresAuth && roles && !authStore.canAccess(roles)) {
    return { name: 'unauthorized' }
  }

  if (to.name === 'auth' && authStore.isAuthenticated) {
    return { name: 'home' }
  }
})

export default router
