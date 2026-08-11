```vue
<script setup lang="ts">
import { computed, reactive } from 'vue'
import TodoStats from '@/shared/components/todo/TodoStats.vue'
import TodoForm from '@/shared/components/todo/TodoForm.vue'
import TodoFilters from '@/shared/components/todo/TodoFilters.vue'
import TodoList from '@/shared/components/todo/TodoList.vue'

type Todo = {
  id: number
  title: string
  completed: boolean
}

const state = reactive({
  todos: [
    { id: 1, title: 'Aprender Vue 3', completed: true },
    { id: 2, title: 'Criar a estrutura do todo', completed: false },
    { id: 3, title: 'Testar filtros e ações', completed: false },
  ] as Todo[],
  filter: 'all' as 'all' | 'active' | 'completed',
})

const filteredTodos = computed(() => {
  return state.todos.filter((todo) => {
    if (state.filter === 'active') return !todo.completed
    if (state.filter === 'completed') return todo.completed
    return true
  })
})

const stats = computed(() => ({
  total: state.todos.length,
  completed: state.todos.filter((todo) => todo.completed).length,
  pending: state.todos.filter((todo) => !todo.completed).length,
}))

function addTodo(title: string) {
  state.todos.push({
    id: Date.now(),
    title,
    completed: false,
  })
}

function toggleTodo(id: number) {
  const todo = state.todos.find((item) => item.id === id)
  if (todo) todo.completed = !todo.completed
}

function removeTodo(id: number) {
  state.todos = state.todos.filter((item) => item.id !== id)
}

function editTodo(id: number, title: string) {
  const todo = state.todos.find((item) => item.id === id)
  if (todo) todo.title = title
}

function updateFilter(value: 'all' | 'active' | 'completed') {
  state.filter = value
}

function clearCompleted() {
  state.todos = state.todos.filter((todo) => !todo.completed)
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-white">To-Do List</h1>
      <p class="mt-1 text-sm text-gray-400">
        Organize suas tarefas e acompanhe seu progresso.
      </p>
    </div>

    <TodoStats
      :total="stats.total"
      :completed="stats.completed"
      :pending="stats.pending"
    />

    <div class="grid gap-6">
      <div class="space-y-6">
        <TodoForm @submit="addTodo" />

        <TodoFilters
          @filter-changed="updateFilter"
          @clear-completed="clearCompleted"
        />
        <TodoList
          :todos="filteredTodos"
          @toggle="toggleTodo"
          @remove="removeTodo"
          @edit="editTodo"
        />
      </div>
    </div>
  </div>
</template>
```
