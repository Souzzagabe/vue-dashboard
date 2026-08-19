<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/modules/samples/states/auth'
import RegisterForm from '@/shared/components/RegisterForm.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const mode = ref<'login' | 'register'>('login')

const username = ref('')
const password = ref('')
const isExchangingGoogle = ref(!!route.query.googleToken)
const error = ref(
    route.query.error === 'google'
        ? 'Não foi possível entrar com o Google. Tente novamente.'
        : ''
)

const apiBaseUrl = import.meta.env.VITE_API_URL

function loginWithGoogle() {
  if (!apiBaseUrl) {
    throw new Error('VITE_API_URL não configurada')
  }

  window.location.href = `${apiBaseUrl}/auth/google`
}

/**
 * O callback do Google redireciona pra cá com ?googleToken=... em vez de
 * já vir logado — essa troca acontece aqui, numa chamada XHR direta
 * (não faz parte da cadeia de redirects entre domínios, então o cookie
 * é aceito normalmente pelo navegador).
 */
async function exchangeGoogleToken(token: string) {
    try {
        await authStore.exchangeGoogleToken(token)

        const redirect = (route.query.redirect as string) || '/home'
        router.push(redirect)
    } catch {
        error.value = 'Não foi possível entrar com o Google. Tente novamente.'
    } finally {
        isExchangingGoogle.value = false
    }
}

if (typeof route.query.googleToken === 'string') {
    exchangeGoogleToken(route.query.googleToken)
}
async function login() {
    error.value = ''

    if (!username.value || !password.value) {
        error.value = 'Preencha usuário e senha'
        return
    }

    try {
        await authStore.login(username.value, password.value)

        const redirect = (route.query.redirect as string) || '/home'
        router.push(redirect)

    } catch (e: any) {
        error.value =
            e.response?.data?.message ||
            'Erro ao fazer login'
    }
}

/**
 * Após o cadastro (POST /users), a API não loga o usuário automaticamente
 * — então aqui preenchemos os campos e chamamos o login normal em seguida.
 */
async function handleRegistered(registeredUsername: string, registeredPassword: string) {
    username.value = registeredUsername
    password.value = registeredPassword
    mode.value = 'login'

    await login()
}
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-950 text-white">

        <div class="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8">

            <div
                v-if="isExchangingGoogle"
                class="flex flex-col items-center gap-3 py-8 text-center"
            >
                <p class="text-sm text-gray-400">Entrando com Google...</p>
            </div>

            <RegisterForm
                v-else-if="mode === 'register'"
                @registered="handleRegistered"
                @cancel="mode = 'login'"
            />

            <div v-else class="flex flex-col gap-6">
                <!-- Título -->
                <div class="text-center">
                    <h1 class="text-2xl font-semibold">Sign in</h1>
                    <p class="text-sm text-gray-400">Access your account</p>
                </div>

                <!-- Erro -->
                <div v-if="error" class="bg-red-500/10 border border-red-500 text-red-400 text-sm p-2 rounded">
                    {{ error }}
                </div>

                <!-- Form -->
                <div class="flex flex-col gap-4">
                    <input
                        v-model="username"
                        @keyup.enter="login"
                        type="text"
                        placeholder="Username"
                        class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />

                    <input
                        v-model="password"
                        @keyup.enter="login"
                        type="password"
                        placeholder="Password"
                        class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                </div>

                <!-- Botão -->
                <button
                    @click="login"
                    :disabled="authStore.isLoading"
                    class="
                        w-full
                        bg-sky-600
                        text-white
                        py-2
                        rounded-lg
                        hover:bg-sky-700
                        transition
                        font-medium
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        flex
                        justify-center
                        items-center
                    "
                >
                    <span v-if="authStore.isLoading">
                        Logging in...
                    </span>
                    <span v-else>
                        Login
                    </span>
                </button>

                <button
                    type="button"
                    class="text-sm text-gray-400 hover:text-white transition text-center"
                    @click="mode = 'register'"
                >
                    Não tem conta? Cadastre-se
                </button>

                <div class="flex items-center gap-3">
                    <div class="h-px flex-1 bg-gray-800" />
                    <span class="text-xs text-gray-500">ou</span>
                    <div class="h-px flex-1 bg-gray-800" />
                </div>

                <button
                    type="button"
                    class="
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-white
                        text-gray-900
                        py-2
                        rounded-lg
                        hover:bg-gray-100
                        transition
                        font-medium
                    "
                    @click="loginWithGoogle"
                >
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.07.72-2.44 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
                        <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.96 11.96 0 000 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
                    </svg>
                    Continuar com Google
                </button>
            </div>

        </div>

    </div>
</template>