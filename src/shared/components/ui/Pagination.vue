<script setup lang="ts">
import type { PropType } from 'vue'
const props = defineProps({
  currentPage: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (e: 'update:page', page: number): void
}>()

function changePage(page: number) {
  if (page < 1 || page > props.totalPages || props.disabled) return
  emit('update:page', page)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <button
      @click="changePage(props.currentPage - 1)"
      :disabled="props.currentPage <= 1 || props.disabled"
      class="rounded-xl bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
    >Anterior</button>
    <span class="text-sm text-slate-300">Página {{ props.currentPage }} de {{ props.totalPages }}</span>
    <button
      @click="changePage(props.currentPage + 1)"
      :disabled="props.currentPage >= props.totalPages || props.disabled"
      class="rounded-xl bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
    >Próxima</button>
  </div>
</template>
