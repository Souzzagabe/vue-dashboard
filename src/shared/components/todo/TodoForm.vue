<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'submit', title: string): void
}>()

const title = ref('')

function handleSubmit() {
  const value = title.value.trim()
  if (!value) return
  emit('submit', value)
  title.value = ''
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="rounded-2xl bg-slate-900 p-4 shadow-sm">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        v-model="title"
        type="text"
        placeholder="Adicione uma nova tarefa"
        class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500"
      />
      <button
        type="submit"
        class="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
      >
        Adicionar
      </button>
    </div>
  </form>
</template>
