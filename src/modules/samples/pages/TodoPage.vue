<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'

import Skeleton from 'primevue/skeleton'

import TodoStats from '@/shared/components/todo/TodoStats.vue'
import TodoForm from '@/shared/components/todo/TodoForm.vue'
import TodoFilters from '@/shared/components/todo/TodoFilters.vue'
import TodoList from '@/shared/components/todo/TodoList.vue'

import { todoService, type Todo } from '@/services/todo.service'

const state = reactive({
  listId: '' as string,
  todos: [] as Todo[],
  filter: 'all' as 'all' | 'active' | 'completed',
  isLoading: true,
  error: '',
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

/**
 * A API organiza tarefas dentro de listas (users -> lists -> todos).
 * Essa tela não tem seletor de lista, então usamos a primeira lista
 * do usuário — e criamos uma automaticamente se ele ainda não tiver
 * nenhuma.
 */
async function loadTodos() {
  state.isLoading = true
  state.error = ''

  try {
    const lists = await todoService.getLists()
    const firstList = lists[0]

    if (firstList !== undefined) {
      state.listId = firstList.id
    } else {
      const created = await todoService.createList('Minhas tarefas')
      state.listId = created.id
    }

    state.todos = await todoService.getTodos(state.listId)
  } catch (e: any) {
    state.error =
      e.response?.data?.message || 'Erro ao carregar tarefas'
  } finally {
    state.isLoading = false
  }
}

async function addTodo(title: string) {
  if (!state.listId) return

  try {
    const { id } = await todoService.createTodo(
      state.listId,
      { title }
    )

    state.todos.push({
      id,
      list_id: state.listId,
      title,
      description: '',
      completed: false,
      created_at: new Date().toISOString(),
    })
  } catch (e: any) {
    state.error =
      e.response?.data?.message || 'Erro ao criar tarefa'
  }
}

async function toggleTodo(id: string) {
  const todo = state.todos.find(
    (item) => item.id === id
  )

  if (!todo || !state.listId) return

  const completed = !todo.completed

  // Atualização otimista
  todo.completed = completed

  try {
    await todoService.updateTodo(
      state.listId,
      id,
      {
        title: todo.title,
        description: todo.description,
        completed,
      }
    )
  } catch (e: any) {
    // Desfaz atualização se a API falhar
    todo.completed = !completed

    state.error =
      e.response?.data?.message ||
      'Erro ao atualizar tarefa'
  }
}

async function removeTodo(id: string) {
  if (!state.listId) return

  const previous = state.todos

  // Atualização otimista
  state.todos = state.todos.filter(
    (item) => item.id !== id
  )

  try {
    await todoService.deleteTodo(
      state.listId,
      id
    )
  } catch (e: any) {
    // Restaura caso dê erro
    state.todos = previous

    state.error =
      e.response?.data?.message ||
      'Erro ao remover tarefa'
  }
}

async function editTodo(
  id: string,
  title: string
) {
  const todo = state.todos.find(
    (item) => item.id === id
  )

  if (!todo || !state.listId) return

  const previousTitle = todo.title

  // Atualização otimista
  todo.title = title

  try {
    await todoService.updateTodo(
      state.listId,
      id,
      {
        title,
        description: todo.description,
        completed: todo.completed,
      }
    )
  } catch (e: any) {
    // Restaura caso dê erro
    todo.title = previousTitle

    state.error =
      e.response?.data?.message ||
      'Erro ao editar tarefa'
  }
}

function updateFilter(
  value: 'all' | 'active' | 'completed'
) {
  state.filter = value
}

async function clearCompleted() {
  const completed = state.todos.filter(
    (todo) => todo.completed
  )

  await Promise.all(
    completed.map((todo) =>
      removeTodo(todo.id)
    )
  )
}

onMounted(() => {
  loadTodos()
})
</script>

<template>
  <div class="space-y-6">

    <!-- HEADER -->

    <div>
      <h1 class="text-2xl font-bold text-white">
        Lista de tarefas
      </h1>

      <p class="mt-1 text-sm text-gray-400">
        Organize suas tarefas e acompanhe seu progresso.
      </p>
    </div>


    <!-- ERROR -->

    <div
      v-if="state.error"
      class="
        rounded-xl
        border
        border-red-500
        bg-red-500/10
        p-3
        text-sm
        text-red-400
      "
    >
      {{ state.error }}
    </div>


    <!-- STATS -->

    <TodoStats
      :total="stats.total"
      :completed="stats.completed"
      :pending="stats.pending"
    />


    <div class="grid gap-6">

      <div class="space-y-6">

        <!-- FORM -->

        <TodoForm
          @submit="addTodo"
        />


        <!-- FILTERS -->

        <TodoFilters
          @filter-changed="updateFilter"
          @clear-completed="clearCompleted"
        />


        <!-- SKELETON -->

        <div
          v-if="state.isLoading"
          class="space-y-3"
        >

          <div
            v-for="item in 4"
            :key="item"
            class="
              flex
              items-center
              gap-4
              rounded-xl
              border
              border-gray-200
              bg-white
              p-4
            "
          >

            <!-- CHECKBOX -->

            <Skeleton
              width="20px"
              height="20px"
              border-radius="6px"
              class="!bg-slate-200"
            />


            <!-- TODO -->

            <div class="flex-1">

              <Skeleton
                width="65%"
                height="16px"
                class="!bg-slate-200"
              />

            </div>


            <!-- ACTION -->

            <Skeleton
              width="32px"
              height="32px"
              border-radius="8px"
              class="!bg-slate-200"
            />

          </div>

        </div>


        <!-- TODO LIST -->

        <TodoList
          v-else
          :todos="filteredTodos"
          @toggle="toggleTodo"
          @remove="removeTodo"
          @edit="editTodo"
        />

      </div>

    </div>

  </div>
</template>