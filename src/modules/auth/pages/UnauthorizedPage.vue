<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="flex min-h-[70vh] items-center justify-center">
    <div class="max-w-lg w-full bg-gray-900 border border-gray-800 rounded-3xl p-10 text-center">
      <span class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white text-2xl mb-6">!</span>
      <h1 class="text-3xl font-semibold text-white mb-3">Acesso negado</h1>
      <p class="text-gray-400 mb-6">
        Você não tem permissão para acessar esta página com sua role atual.
      </p>
      <button
        @click="goHome"
        class="bg-sky-600 text-white px-6 py-3 rounded-xl hover:bg-sky-700 transition"
      >
        Voltar para o dashboard
      </button>
    </div>
  </div>
</template>
