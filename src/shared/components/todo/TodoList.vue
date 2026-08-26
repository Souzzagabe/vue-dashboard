<script setup lang="ts">
import { ref } from 'vue'
import TodoItem from './TodoItem.vue'

type Todo = {
  id: string
  title: string
  completed: boolean
}

const props = defineProps<{
  todos: Todo[]
  reorderable?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'remove', id: string): void
  (e: 'edit', id: string, title: string): void
  (e: 'reorder', orderedIds: string[]): void
}>()

const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function onDragStart(index: number) {
  if (!props.reorderable) return

  draggedIndex.value = index
}

function onDragEnter(index: number) {
  if (!props.reorderable) return

  dragOverIndex.value = index
}

function onDrop(index: number) {
  if (!props.reorderable) return

  if (draggedIndex.value === null || draggedIndex.value === index) {
    resetDrag()
    return
  }

  const reordered = [...props.todos]
  const [moved] = reordered.splice(draggedIndex.value, 1)

  if (!moved) {
    resetDrag()
    return
  }

  reordered.splice(index, 0, moved)

  emit(
    'reorder',
    reordered.map((todo) => todo.id),
  )

  resetDrag()
}

function resetDrag() {
  draggedIndex.value = null
  dragOverIndex.value = null
}
</script>

<template>
  <div class="rounded-2xl bg-slate-900 p-4 shadow-sm">
    <template v-if="props.todos.length">
      <ul class="flex flex-col gap-3">
        <TodoItem
          v-for="(todo, index) in props.todos"
          :key="todo.id"
          :todo="todo"
          :reorderable="props.reorderable"
          :draggable="props.reorderable ? 'true' : 'false'"
          :class="[
            'transition',
            props.reorderable
              ? 'cursor-grab active:cursor-grabbing'
              : 'cursor-default',
            dragOverIndex === index && draggedIndex !== index
              ? 'ring-2 ring-sky-500'
              : '',
            draggedIndex === index ? 'opacity-40' : '',
          ]"
          @dragstart="onDragStart(index)"
          @dragenter.prevent="onDragEnter(index)"
          @dragover.prevent
          @drop="onDrop(index)"
          @dragend="resetDrag"
          @toggle="(id) => emit('toggle', id)"
          @remove="(id) => emit('remove', id)"
          @edit="(id, title) => emit('edit', id, title)"
        />
      </ul>
    </template>

    <div
      v-else
      class="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400"
    >
      Nenhuma tarefa encontrada. Adicione uma tarefa para começar.
    </div>
  </div>
</template>