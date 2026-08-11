<script setup lang="ts">
import TodoItem from './TodoItem.vue'

type Todo = {
  id: number
  title: string
  completed: boolean
}

const props = defineProps<{
  todos: Todo[]
}>()

const emit = defineEmits<{
  (e: 'toggle', id: number): void
  (e: 'remove', id: number): void
  (e: 'edit', id: number, title: string): void
}>()
</script>

<template>
  <div class="rounded-2xl bg-slate-900 p-4 shadow-sm">
    <template v-if="props.todos.length">
      <ul class="flex flex-col gap-3">
        <TodoItem
          v-for="todo in props.todos"
          :key="todo.id"
          :todo="todo"
          @toggle="(id) => emit('toggle', id)"
          @remove="(id) => emit('remove', id)"
          @edit="(id, title) => emit('edit', id, title)"
        />
      </ul>
    </template>
    <div v-else class="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
      Nenhuma tarefa encontrada. Adicione uma tarefa para começar.
    </div>
  </div>
</template>
