<script setup lang="ts">
interface TodoStatsProps {
  total: number
  completed: number
  pending: number
}

const props = defineProps<TodoStatsProps>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl bg-slate-900 p-4 text-white">
    <div class="rounded-xl bg-slate-800 p-4 text-center">
      <div class="text-sm uppercase text-gray-400">Total</div>
      <div class="mt-2 text-2xl font-semibold">{{ props.total }}</div>
    </div>
    <div class="rounded-xl bg-slate-800 p-4 text-center">
      <div class="text-sm uppercase text-gray-400">Concluídas</div>
      <div class="mt-2 text-2xl font-semibold">{{ props.completed }}</div>
    </div>
    <div class="rounded-xl bg-slate-800 p-4 text-center">
      <div class="text-sm uppercase text-gray-400">Pendentes</div>
      <div class="mt-2 text-2xl font-semibold">{{ props.pending }}</div>
    </div>
  </div>
</template>
