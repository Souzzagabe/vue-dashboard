<script setup lang="ts">
import { ref, watch } from 'vue'

interface TodoItem {
  id: string
  title: string
  completed: boolean
  position?: number
}

const props = defineProps<{
  todo: TodoItem
  reorderable?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'remove', id: string): void
  (e: 'edit', id: string, title: string): void
}>()

const isEditing = ref(false)

const editTitle = ref(props.todo.title)

watch(
  () => props.todo.title,
  (value) => {
    editTitle.value = value
  }
)

function startEdit() {
  isEditing.value = true
}

function cancelEdit() {
  editTitle.value = props.todo.title
  isEditing.value = false
}

function saveEdit() {
  const title = editTitle.value.trim()

  if (!title) return

  if (title !== props.todo.title) {
    emit('edit', props.todo.id, title)
  }

  isEditing.value = false
}
</script>

<template>
  <li
    class="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center"
  >
    <div class="flex flex-1 items-center gap-3">
      <span
        v-if="props.reorderable"
        class="select-none rounded-lg p-1 text-slate-600 transition hover:bg-slate-800 hover:text-slate-300"
        title="Arraste para reordenar"
      >
        <svg
          width="14"
          height="20"
          viewBox="0 0 14 20"
          fill="currentColor"
        >
          <circle cx="3" cy="3" r="1.6" />
          <circle cx="11" cy="3" r="1.6" />
          <circle cx="3" cy="10" r="1.6" />
          <circle cx="11" cy="10" r="1.6" />
          <circle cx="3" cy="17" r="1.6" />
          <circle cx="11" cy="17" r="1.6" />
        </svg>
      </span>

      <input
        type="checkbox"
        class="h-5 w-5 rounded border-slate-700 bg-slate-900 text-sky-500"
        :checked="props.todo.completed"
        @change="emit('toggle', props.todo.id)"
      />

      <div class="flex-1">
        <template v-if="isEditing">
          <input
            v-model="editTitle"
            type="text"
            class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-sky-500"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
          />
        </template>

        <template v-else>
          <span
            class="block cursor-text"
            :class="
              props.todo.completed
                ? 'line-through text-slate-500'
                : 'text-slate-100'
            "
            @dblclick="startEdit"
          >
            {{ props.todo.title }}
          </span>
        </template>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <template v-if="isEditing">
        <button
          type="button"
          class="rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-500"
          @click="saveEdit"
        >
          Salvar
        </button>

        <button
          type="button"
          class="rounded-xl bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
          @click="cancelEdit"
        >
          Cancelar
        </button>
      </template>

      <template v-else>
        <button
          type="button"
          class="rounded-xl bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
          @click="startEdit"
        >
          Editar
        </button>

        <button
          type="button"
          class="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-500"
          @click="emit('remove', props.todo.id)"
        >
          Apagar
        </button>
      </template>
    </div>
  </li>
</template>