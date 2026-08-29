<script setup lang="ts">
import { ref } from 'vue'

import { authService } from '@/services/auth.service'

const emit = defineEmits<{
  registered: [email: string, password: string]
  cancel: []
}>()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = ref(false)

async function register() {
  error.value = ''

  if (!email.value || !password.value || !confirmPassword.value) {
    error.value = 'Preencha todos os campos'
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Digite um e-mail válido'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Senha deve ter ao menos 6 caracteres'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'As senhas não coincidem'
    return
  }

  isLoading.value = true

  try {
    await authService.register({
      email: email.value,
      password: password.value,
    })

    emit('registered', email.value, password.value)
  } catch (e: any) {
    if (e.response?.status === 409) {
      error.value = 'Esse e-mail já está cadastrado'
    } else {
      error.value =
        e.response?.data?.message ||
        'Erro ao criar usuário'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="text-center">
      <h1 class="text-2xl font-semibold">
        Create account
      </h1>

      <p class="text-sm text-gray-400">
        Sign up to get started
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
      @submit.prevent="register"
    >
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        autocomplete="email"
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
        autocomplete="new-password"
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
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm password"
        autocomplete="new-password"
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
        :disabled="isLoading"
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
        <span v-if="isLoading">
          Creating account...
        </span>

        <span v-else>
          Sign up
        </span>
      </button>

      <button
        type="button"
        class="text-sm text-gray-400 hover:text-white transition"
        @click="emit('cancel')"
      >
        Already have an account? Sign in
      </button>
    </form>
  </div>
</template>