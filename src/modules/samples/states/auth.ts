import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { User } from '@/modules/auth/pages/model/user'

type AuthPayload = {
    token: string
    user: User
}

export const useAuthStore = defineStore('auth', () => {
    const isLoading = ref(false)
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)

    const isAuthenticated = computed(() => !!token.value)

    function init() {
        const stored = localStorage.getItem('auth')

        if (stored) {
            const data: AuthPayload = JSON.parse(stored)
            token.value = data.token
            user.value = data.user
        }
    }

    function generateFakeToken(email: string) {
        return btoa(`${email}:${Date.now()}`)
    }

    async function login(email: string, password: string) {
        try {
            isLoading.value = true

            await new Promise((resolve) => setTimeout(resolve, 1500))

            const fakeUser: User = {
                id: '31',
                name: 'Gabriel Souza',
                email
            }

            const fakeToken = generateFakeToken(email)

            user.value = fakeUser
            token.value = fakeToken

            localStorage.setItem('auth', JSON.stringify({
                token: fakeToken,
                user: fakeUser
            }))

        } finally {
            isLoading.value = false
        }
    }

    async function logout() {
        try {
            isLoading.value = true

            await new Promise((resolve) => setTimeout(resolve, 500))

            user.value = null
            token.value = null

            localStorage.removeItem('auth')

        } finally {
            isLoading.value = false
        }
    }

    return {
        isLoading,
        user,
        token,
        isAuthenticated,
        login,
        logout,
        init
    }
})