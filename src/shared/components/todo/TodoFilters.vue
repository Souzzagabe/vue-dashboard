<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'filter-changed', value: 'all' | 'active' | 'completed'): void
  (e: 'clear-completed'): void
}>()

const selected = ref<'all' | 'active' | 'completed'>('all')

function setFilter(value: 'all' | 'active' | 'completed') {
  selected.value = value
  emit('filter-changed', value)
}
</script>

<template>
  <div class="rounded-2xl bg-slate-900 p-4 shadow-sm">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          :class="selected === 'all' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'"
          class="rounded-xl px-4 py-2 text-sm font-medium transition hover:bg-slate-700"
          @click="setFilter('all')"
        >
          Todas
        </button>
        <button
          type="button"
          :class="selected === 'active' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'"
          class="rounded-xl px-4 py-2 text-sm font-medium transition hover:bg-slate-700"
          @click="setFilter('active')"
        >
          Ativas
        </button>
        <button
          type="button"
          :class="selected === 'completed' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'"
          class="rounded-xl px-4 py-2 text-sm font-medium transition hover:bg-slate-700"
          @click="setFilter('completed')"
        >
          Concluídas
        </button>
      </div>

      <button
        type="button"
        class="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
        @click="emit('clear-completed')"
      >
        Limpar concluídas
      </button>
    </div>
  </div>
</template>
