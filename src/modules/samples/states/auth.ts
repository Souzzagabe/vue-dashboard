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
    email: string,
    password: string
  ) {
    try {
      isLoading.value = true

      await authService.login({
        email,
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

  async function exchangeGoogleToken(googleToken: string) {
    try {
      isLoading.value = true

      await authService.exchangeGoogleToken(googleToken)

      /*
       * Mesma lógica do login comum: o backend acabou de criar o
       * cookie HttpOnly, então só confirmamos buscando o usuário.
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
      await fetchUser()
    } catch {
      /*
       * Não existe sessão válida.
       *
       * Isso é normal quando o usuário ainda não fez login.
       */
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
    exchangeGoogleToken,
  }
})