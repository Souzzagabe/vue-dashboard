<template>
  <div class="rounded-3xl border border-red-500/20 bg-slate-950 p-8 text-center text-red-300">
    <div class="mb-4 text-4xl">⚠️</div>
    <p class="text-lg font-semibold text-white">{{ title }}</p>
    <p class="mt-2 text-sm text-slate-400">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: 'Ocorreu um erro' },
  description: { type: String, default: 'Algo deu errado ao carregar os dados.' },
})
</script>
