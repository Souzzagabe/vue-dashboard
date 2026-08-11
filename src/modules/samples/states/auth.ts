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

    const cookieName = 'auth'

    function setAuthCookie(value: string) {
        document.cookie = `${cookieName}=${encodeURIComponent(value)}; path=/; max-age=86400`
    }

    function getAuthCookie() {
        return document.cookie
            .split('; ')
            .find((cookie) => cookie.startsWith(`${cookieName}=`))
            ?.split('=')[1]
    }

    function deleteAuthCookie() {
        document.cookie = `${cookieName}=; path=/; max-age=0`
    }

    function generateFakeToken(email: string) {
        return btoa(`${email}:${Date.now()}`)
    }

    function init() {
        const stored = getAuthCookie()

        if (stored) {
            const data: AuthPayload = JSON.parse(decodeURIComponent(stored))
            token.value = data.token
            user.value = data.user
        }
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

            setAuthCookie(JSON.stringify({
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

            deleteAuthCookie()

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