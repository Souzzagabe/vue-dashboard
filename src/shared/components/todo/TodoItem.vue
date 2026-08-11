<script setup lang="ts">
import { ref, watch } from 'vue'
import { useNotificationStore } from '@/modules/notifications/stores/notification'

interface TodoItem {
  id: number
  title: string
  completed: boolean
}

const props = defineProps<{
  todo: TodoItem
}>()

const emit = defineEmits<{
  (e: 'toggle', id: number): void
  (e: 'remove', id: number): void
  (e: 'edit', id: number, title: string): void
}>()

const notificationStore = useNotificationStore()
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
  if (!title) {
    notificationStore.add({
      type: 'error',
      title: 'Título inválido',
      message: 'A tarefa não pode ficar vazia ao salvar.',
      duration: 4000,
    })
    return
  }

  if (title !== props.todo.title) {
    emit('edit', props.todo.id, title)
  }
  isEditing.value = false
}
</script>

<template>
  <li class="flex flex-col gap-3 rounded-2xl bg-slate-950 border border-slate-800 p-4 sm:flex-row sm:items-center">
    <div class="flex flex-1 items-center gap-3">
      <input
        type="checkbox"
        class="h-5 w-5 rounded border-slate-700 bg-slate-900 text-sky-500"
        :checked="props.todo.completed"
        @change="() => emit('toggle', props.todo.id)"
      />

      <div class="flex-1">
        <template v-if="isEditing">
          <input
            v-model="editTitle"
            type="text"
            class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-sky-500"
          />
        </template>
        <template v-else>
          <span
            @dblclick="startEdit"
            :class="props.todo.completed ? 'line-through text-slate-500' : 'text-slate-100'"
            class="block cursor-text"
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
          @click="() => emit('remove', props.todo.id)"
        >
          Apagar
        </button>
      </template>
    </div>
  </li>
</template>
