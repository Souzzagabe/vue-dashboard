import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import {
  authService,
  type AuthUser,
} from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)

  const isLoading = ref(false)
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => {
    return !!user.value
  })

  async function login(
    username: string,
    password: string
  ) {
    try {
      isLoading.value = true

      await authService.login({
        username,
        password,
      })

      /*
       * O backend acabou de criar o cookie HttpOnly.
       *
       * Não tentamos acessar o token aqui.
       */

      await fetchUser()

    } finally {
      isLoading.value = false
    }
  }

  async function fetchUser() {
    try {
      const authenticatedUser = await authService.me()

      user.value = authenticatedUser

      return authenticatedUser

    } catch (error) {
      user.value = null

      throw error
    }
  }

async function init() {
  if (isInitialized.value) {
    return
  }

  try {
    console.log('Inicializando autenticação...')

    await fetchUser()

    console.log('Autenticação restaurada:', user.value)
  } catch (error) {
    console.error('Falha ao restaurar autenticação:', error)

    user.value = null
  } finally {
    isInitialized.value = true
  }
}

  async function logout() {
    try {
      isLoading.value = true

      await authService.logout()

    } finally {
      user.value = null
      isLoading.value = false
      isInitialized.value = true
    }
  }

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated,

    login,
    logout,
    init,
    fetchUser,
  }
})