import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Role, User } from '@/shared/types'

type AuthPayload = {
    token: string
    user: User
}

const authCookieName = 'auth'

function setAuthCookie(value: string) {
    document.cookie = `${authCookieName}=${encodeURIComponent(value)}; path=/; max-age=86400; samesite=lax`
}

function getAuthCookie() {
    return document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith(`${authCookieName}=`))
        ?.split('=')[1]
}

function deleteAuthCookie() {
    document.cookie = `${authCookieName}=; path=/; max-age=0`
}

function persistAuth(tokenValue: string | null, userValue: User | null) {
    if (!tokenValue || !userValue) {
        deleteAuthCookie()
        return
    }

    setAuthCookie(JSON.stringify({ token: tokenValue, user: userValue }))
}

function inferRoleFromEmail(email: string): Role {
    const normalized = email.toLowerCase()
    if (normalized.includes('admin')) return 'admin'
    if (normalized.includes('manager')) return 'manager'
    return 'user'
}

export const useAuthStore = defineStore('auth', () => {
    const isLoading = ref(false)
    const initialized = ref(false)
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)

    const isAuthenticated = computed(() => !!token.value && !!user.value)

    const canAccess = (roles?: Role[]) => {
        if (!roles || roles.length === 0) return true
        return !!user.value && roles.includes(user.value.role)
    }

    function init() {
        const stored = getAuthCookie()

        if (stored) {
            try {
                const data: AuthPayload = JSON.parse(decodeURIComponent(stored))
                token.value = data.token
                user.value = data.user
            } catch {
                deleteAuthCookie()
            }
        }

        initialized.value = true
    }

    function generateFakeToken(email: string) {
        return btoa(`${email}:${Date.now()}`)
    }

    async function login(email: string, password: string, role?: Role) {
        try {
            isLoading.value = true

            await new Promise((resolve) => setTimeout(resolve, 1500))

            const userRole = role ?? inferRoleFromEmail(email)
            const fakeUser: User = {
                id: String(Date.now()),
                name: 'Gabriel Souza',
                email,
                role: userRole,
            }

            const fakeToken = generateFakeToken(email)

            user.value = fakeUser
            token.value = fakeToken

            persistAuth(fakeToken, fakeUser)

        } finally {
            isLoading.value = false
        }
    }

    function updateProfile(updatedUser: Partial<User>) {
        if (!user.value) return

        user.value = {
            ...user.value,
            ...updatedUser,
        }

        persistAuth(token.value, user.value)
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
        initialized,
        user,
        token,
        isAuthenticated,
        canAccess,
        login,
        updateProfile,
        logout,
        init,
    }
})
