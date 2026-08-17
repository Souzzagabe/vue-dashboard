<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/modules/samples/states/auth'

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const error = ref('')

async function login() {
  error.value = ''

  if (!username.value || !password.value) {
    error.value = 'Preencha usuário e senha'
    return
  }

  try {
    await authStore.login(
      username.value,
      password.value
    )

    const redirect =
      (route.query.redirect as string) || '/home'

    await router.push(redirect)

  } catch (e: any) {
    error.value =
      e.response?.data?.message ||
      'Usuário ou senha inválidos'
  }
}
</script>

<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gray-950 text-white"
  >
    <div
      class="
        w-full
        max-w-md
        bg-gray-900
        border
        border-gray-800
        rounded-2xl
        shadow-xl
        p-8
        flex
        flex-col
        gap-6
      "
    >
      <div class="text-center">
        <h1 class="text-2xl font-semibold">
          Sign in
        </h1>

        <p class="text-sm text-gray-400">
          Access your account
        </p>
      </div>

      <div
        v-if="error"
        class="
          bg-red-500/10
          border
          border-red-500
          text-red-400
          text-sm
          p-2
          rounded
        "
      >
        {{ error }}
      </div>

      <form
        class="flex flex-col gap-4"
        @submit.prevent="login"
      >
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          autocomplete="username"
          class="
            w-full
            px-4
            py-2
            rounded-lg
            bg-gray-800
            border
            border-gray-700
            text-white
            placeholder-gray-500
            focus:outline-none
            focus:ring-2
            focus:ring-sky-600
          "
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          autocomplete="current-password"
          class="
            w-full
            px-4
            py-2
            rounded-lg
            bg-gray-800
            border
            border-gray-700
            text-white
            placeholder-gray-500
            focus:outline-none
            focus:ring-2
            focus:ring-sky-600
          "
        />

        <button
          type="submit"
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
      </form>
    </div>
  </div>
</template>