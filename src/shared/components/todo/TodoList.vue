<script setup lang="ts">
import { ref } from 'vue'

type Todo = {
  id: string
  list_id: string
  title: string
  description?: string
  completed: boolean
  position: number
  created_at: string
}

defineProps<{
  todo: Todo
  reorderable?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'remove', id: string): void
  (e: 'edit', id: string, title: string): void
}>()

const isEditing = ref(false)
const editedTitle = ref('')

function startEditing(title: string) {
  editedTitle.value = title
  isEditing.value = true
}

function saveEditing(id: string) {
  const title = editedTitle.value.trim()

  if (title) {
    emit('edit', id, title)
  }

  isEditing.value = false
}

function cancelEditing() {
  isEditing.value = false
  editedTitle.value = ''
}
</script>

<template>
  <li
    class="flex items-center gap-3 rounded-xl bg-slate-800 p-4 transition"
  >
    <!-- Checkbox -->
    <button
      type="button"
      class="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-500 transition"
      :class="
        todo.completed
          ? 'border-sky-500 bg-sky-500'
          : 'hover:border-sky-400'
      "
      @click.stop="emit('toggle', todo.id)"
    >
      <span
        v-if="todo.completed"
        class="text-xs font-bold text-white"
      >
        ✓
      </span>
    </button>

    <!-- Conteúdo -->
    <div class="min-w-0 flex-1">
      <!-- Edição -->
      <form
        v-if="isEditing"
        class="flex gap-2"
        @submit.prevent="saveEditing(todo.id)"
      >
        <input
          v-model="editedTitle"
          autofocus
          type="text"
          class="min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          @keydown.escape="cancelEditing"
        />

        <button
          type="submit"
          class="rounded-lg bg-sky-600 px-3 py-2 text-sm text-white hover:bg-sky-500"
        >
          Salvar
        </button>

        <button
          type="button"
          class="rounded-lg bg-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-600"
          @click="cancelEditing"
        >
          Cancelar
        </button>
      </form>

      <!-- Visualização -->
      <template v-else>
        <p
          class="truncate text-sm font-medium transition"
          :class="
            todo.completed
              ? 'text-slate-500 line-through'
              : 'text-white'
          "
        >
          {{ todo.title }}
        </p>

        <p
          v-if="todo.description"
          class="mt-1 text-xs text-slate-400"
        >
          {{ todo.description }}
        </p>
      </template>
    </div>

    <!-- Ações -->
    <div
      v-if="!isEditing"
      class="flex shrink-0 items-center gap-2"
    >
      <button
        type="button"
        class="rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-700 hover:text-white"
        @click.stop="startEditing(todo.title)"
      >
        Editar
      </button>

      <button
        type="button"
        class="rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
        @click.stop="emit('remove', todo.id)"
      >
        Excluir
      </button>
    </div>
  </li>
</template>