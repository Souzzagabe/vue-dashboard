import { createRouter, createWebHistory } from 'vue-router'

import { routes } from './routes'

import { useAuthStore } from '@/modules/samples/states/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Primeiro verifica se já existe uma sessão válida
  // através do cookie HttpOnly.
  if (!authStore.isInitialized) {
    await authStore.init()
  }

  // Rota protegida sem autenticação
  if (
    to.meta.requiresAuth &&
    !authStore.isAuthenticated
  ) {
    return {
      name: 'auth',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  // Usuário autenticado não precisa acessar o login
  if (
    to.name === 'auth' &&
    authStore.isAuthenticated
  ) {
    return {
      name: 'home',
    }
  }

  // Admin
  if (
    to.meta.requiresAdmin &&
    authStore.user?.role !== 'admin'
  ) {
    return {
      name: 'home',
    }
  }

  return true
})

export default router