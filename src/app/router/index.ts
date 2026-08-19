import { createRouter, createWebHistory } from 'vue-router'

import { routes } from './routes'

import { useAuthStore } from '@/modules/samples/states/auth';

const router = createRouter({

  history: createWebHistory(import.meta.env.BASE_URL),

  routes,

})

router.beforeEach(async (to) => {

  const authStore = useAuthStore()

  /**
   * Navegações com reload de página inteira (voltar do login com Google,
   * ou dar F5 na página) fazem a store voltar ao estado inicial mesmo com
   * o cookie de sessão ainda válido. Antes de decidir redirecionar,
   * confirma com o backend (init() chama /me, que lê o cookie).
   */
  if (!authStore.isInitialized) {
    await authStore.init()
  }

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