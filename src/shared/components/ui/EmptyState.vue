<template>
  <div class="rounded-3xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-slate-400">
    <div class="mb-4 text-4xl">😕</div>
    <p class="text-lg font-semibold text-white">{{ title }}</p>
    <p class="mt-2 text-sm text-slate-400">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: 'Nada por aqui' },
  description: { type: String, default: 'Não há dados disponíveis no momento.' },
})
</script>
